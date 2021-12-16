const Promise = require('bluebird');
const net = require('net');
const fs = require('fs-extra');

const { getCorrelationId } = require('@mimik/request-helper');

const { socketsDir } = require('../../configuration/config');

const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../models/nodeDetailsModel');

const { routeRequest } = require('./requestRouter');

const {
  formatToJson,
  formatToHttp,
} = require('./converters/httpJsonConverter');

const servers = {};
const streams = {};
let SHUTDOWN = false;

const initializeSocket = (nodeId, correlationId) => {
  const SOCKET_FILE = `${socketsDir}/edgeDaemon_${nodeId}.sock`;
  let server;

  saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Loading interprocess communications', undefined, correlationId);

  function createServer(socket) {
    saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Creating server', undefined, correlationId);
    server = net.createServer((stream) => {
      const requestCorrelationId = getCorrelationId();
      saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Incoming connection acknowledged', undefined, requestCorrelationId);

      streams[nodeId] = (stream);

      stream.on('end', () => {
        saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Incoming client disconnected', undefined, requestCorrelationId);
        delete streams[nodeId];
      });

      stream.on('error', (error) => {
        saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.EDGEDAEMON_FACING, 'Error occured on incoming socket', { error }, requestCorrelationId);
      });

      stream.on('data', (msg) => {
        const msgStr = msg.toString();

        const formattedRequest = formatToJson(msgStr);
        routeRequest(nodeId, formattedRequest, requestCorrelationId)
          .then((response) => {
            try {
              stream.setEncoding('utf8');
              saveLog(
                nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Sending response from docker socket', { response }, requestCorrelationId,
              );

              const { status, headers, data: responseData } = response;
              const { httpHeaders, isChunked } = formatToHttp(status, headers);

              if (isChunked) {
                stream.write(httpHeaders);
                responseData.forEach((body) => {
                  if (body && body.length > 0) {
                    const size = (body.length).toString(16);
                    stream.write(`${size}\r\n`);
                    stream.write(body);
                    stream.write('\r\n');
                  }
                });
                stream.end('0\r\n\r\n');
              }
              else if (response.data[0]) {
                stream.write(`${httpHeaders}${response.data[0]}`);
              }
              else {
                stream.write(httpHeaders);
              }
            }
            catch (error) {
              saveLog(
                nodeId, LOG_TYPE.ERROR, SERVER_TYPE.EDGEDAEMON_FACING, 'Error occured while writing data to stream', { error }, requestCorrelationId,
              );
            }
          })
          .catch((error) => {
            saveLog(
              nodeId, LOG_TYPE.ERROR, SERVER_TYPE.EDGEDAEMON_FACING, 'Error received from docker request server', { error }, requestCorrelationId,
            );
            stream.end();
          });
      });
    })
      .listen(socket)
      .on('connection', () => { });
    return server;
  }

  saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Checking for left over server');

  return fs.ensureDir(socketsDir)
    .then(() => fs.stat(SOCKET_FILE)
      .then(() => fs.unlink(SOCKET_FILE)
        .catch((error) => {
          saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.EDGEDAEMON_FACING, 'Error occured while removing old socket file', { error });
        }))
      .catch(() => { })
      .then(() => {
        server = createServer(SOCKET_FILE);
        servers[nodeId] = server;
        fs.chmodSync(SOCKET_FILE, 777);
      }))
    .then(() => SOCKET_FILE);
};

const terminateSocket = (nodeId, correlationId) => {
  if (streams[nodeId]) {
    saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Terminating stream', undefined, correlationId);
    try {
      streams[nodeId].end();
    }
    catch (error) {
      saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Error occured while terminating stream', { error }, correlationId);
    }
  }
  if (servers[nodeId]) {
    saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Terminating server', undefined, correlationId);
    try {
      servers[nodeId].close();
    }
    catch (error) {
      saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Error occured while terminating server', { error }, correlationId);
    }
  }

  return Promise.resolve();
};

function cleanup() {
  if (!SHUTDOWN) {
    SHUTDOWN = true;

    const nodeIds = Object.keys(servers);

    Promise.map(nodeIds, (nodeId) => {
      saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Received shutdown request');
      terminateSocket(nodeId);
    })
      .then(() => {
        process.exit(0);
      });
  }
}
process.on('SIGINT', cleanup);

module.exports = {
  initializeSocket,
  terminateSocket,
};
