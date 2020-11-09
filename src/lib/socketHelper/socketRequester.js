const http = require('http');
const Promise = require('bluebird');

const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../models/anaxSocketModel');

const makeSockerRequester = (nodeId) => {
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
      headers,
      host,
    };
    saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.DOCKER_PROXY_FACING, 'Sending request', { options }, correlationId);

    const response = {};

    try {
      const callback = (res) => {
        response.data = [];
        response.headers = res.headers;
        response.status = {
          code: res.statusCode,
          message: res.statusMessage,
        };

        res.setEncoding('utf8');
        res.on('data', (data) => {
          response.data.push(data);
        });
        res.on('error', (error) => {
          saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.DOCKER_PROXY_FACING, 'Error response received', { error }, correlationId);
          reject(error);
        });
        res.on('close', () => {
          saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.DOCKER_PROXY_FACING, 'Successful response received', { response }, correlationId);
          resolve(response);
        });
      };

      const clientRequest = http.request(options, callback);
      if (body) clientRequest.write(body);
      clientRequest.end();
    }
    catch (error) {
      saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.DOCKER_PROXY_FACING, 'Error occured while requesting docker socket', { error }, correlationId);
      reject();
    }
  });

  return {
    request,
  };
};

module.exports = makeSockerRequester;
