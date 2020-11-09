const http = require('http');
const Promise = require('bluebird');

const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../models/anaxSocketModel');

const makeDockerRequester = (nodeId) => {
  const DOCKER_SOCKET_FILE = '/var/run/docker.sock';

  const request = ({
    method,
    host,
    endpoint,
    headers,
    body,
  }, correlationId) => new Promise((resolve, reject) => {
    const options = {
      socketPath: DOCKER_SOCKET_FILE,
      path: endpoint,
      method,
      body,
      host,
      headers,
    };

    const responses = [];
    try {
      const callback = (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.DOCKER_FACING, 'Successful docker response received', { data }, correlationId);
          responses.push({
            headers: res.headers,
            body: data,
            status: {
              code: res.statusCode,
              message: res.statusMessage,
            },
          });
        });
        res.on('error', (data) => {
          saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.DOCKER_FACING, 'Error docker response received', { data }, correlationId);
          reject(data);
        });
        res.on('close', () => {
          resolve(responses);
        });
      };

      const clientRequest = http.request(options, callback);
      clientRequest.end();
    }
    catch (error) {
      saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.DOCKER_FACING, 'Error occured while trying to send docker request', { error }, correlationId);
      reject();
    }
  });

  return {
    request,
  };
};

module.exports = makeDockerRequester;
