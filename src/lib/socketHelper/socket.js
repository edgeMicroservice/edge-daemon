/* eslint-disable no-unused-vars */
const net = require('net');
const fs = require('fs-extra');

const {
  hzn: {
    nodeSocketsDir,
  },
} = require('../../configuration/config');

const makeSockerRequester = require('./socketRequester');
const makeHttpRequester = require('./httpRequester');

const {
  formatToJson,
  formatToHttp,
} = require('./httpJson');

const makeLogger = require('./logger');
// const { forEach } = require('lodash');

const initializeSocket = (nodeId) => {
  const { log } = makeLogger(nodeId);

  const connections = {};
  let SHUTDOWN = false;
  const SOCKET_FILE = `${nodeSocketsDir}/edgeDaemon_${nodeId}.sock`;
  let server;

  log('Loading interprocess communications test');

  function createServer(socket) {
    log('Creating server.');
    server = net.createServer((stream) => {
      log('Incoming connection acknowledged.');

      const self = Date.now();
      connections[self] = (stream);

      stream.on('end', () => {
        log('Incoming client disconnected.');
        delete connections[self];
      });

      stream.on('error', (err) => {
        console.log('===> error on incoming socket stream: ', err);
      });

      stream.on('data', (msg) => {
        const msgStr = msg.toString();

        log('Incoming request received on socket:', { msgStr });

        const formattedRequest = formatToJson(msgStr);

        // makeHttpRequester(nodeId).request(formattedRequest);

        makeSockerRequester(nodeId).request(formattedRequest)
          .then((responses) => {
            try {
              // plain/text
              log('Incoming in then, responses: ', responses);

              // responses.forEach(({ status, headers, body }) => {
              //   const output = formatToHttp(status, headers, body);
              //   console.log('===> response', { status, headers, body });
              //   console.log('===> output', output);
              //   stream.write(output);
              // });

              responses.forEach(({ status, headers, body }) => {
                stream.write(`${[
                  'HTTP/1.1 200 OK',
                  'Content-Type: plain/text; charset=UTF-8',
                  'Content-Encoding: UTF-8',
                  'Accept-Ranges: bytes',
                  'Connection: close',
                ].join('\r\n')}\r\n\r\n`);
                stream.write(body);
              });

              // stream.end();
              // stream.write(responses.join(''));
              // responses.forEach((response) => {
              //   console.log('===> writing response');
              //   stream.write(response);
              // });
              setTimeout(() => {
                console.log('===> closing Incoming stream');
                stream.end();
              }, 4000);
            }
            catch (error) {
              console.log('===> error occured while writing data to stream', error);
            }
          })
          .catch((data) => {
            log('Incoming in catch');
            stream.write(data);
            stream.end();
          });
      });
    })
      .listen(socket)
      .on('connection', (sct) => {
        log('Client connected.');
      });

    return server;
  }

  log('Checking for leftover socket.');

  function cleanup() {
    if (!SHUTDOWN) {
      SHUTDOWN = true;
      log('\n', 'Terminating.', '\n');
      if (Object.keys(connections).length) {
        const clients = Object.keys(connections);
        while (clients.length) {
          const client = clients.pop();
          connections[client].write('__disconnect');
          connections[client].end();
        }
      }
      server.close();
      process.exit(0);
    }
  }
  process.on('SIGINT', cleanup);

  return fs.ensureDir(nodeSocketsDir)
    .then(() => fs.stat(SOCKET_FILE)
      .then(() => fs.unlink(SOCKET_FILE)
        .catch((error) => {
          console.log('===> error occured while removing old socket file', error);
        }))
      .catch(() => { })
      .then(() => {
        server = createServer(SOCKET_FILE);
        fs.chmodSync(SOCKET_FILE, 777);
      }))
    .then(() => SOCKET_FILE);

  // fs.stat(SOCKET_FILE, (err, stats) => {
  //   if (err) {
  //     // start server
  //     log('No leftover socket found.');
  //     server = createServer(SOCKET_FILE);
  //     fs.chmodSync(SOCKET_FILE, 777);
  //     return;
  //   }
  //   // remove file then start server
  //   log('Removing leftover socket.');
  //   fs.unlink(SOCKET_FILE, (error) => {
  //     if (err) {
  //       // This should never happen.
  //       log(error); process.exit(0);
  //     }
  //     server = createServer(SOCKET_FILE);
  //   });
  // });
};

module.exports = {
  initializeSocket,
};
