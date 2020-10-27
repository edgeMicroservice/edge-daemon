/* eslint-disable no-unused-vars */
const http = require('http');
const Promise = require('bluebird');
const { response } = require('express');

const makeLogger = require('./logger');

const makeSockerRequester = (nodeId) => {
  const DOCKER_SOCKET_FILE = '/var/run/docker.sock';

  const { log } = makeLogger(nodeId);

  const request = ({
    method,
    host,
    endpoint,
    headers,
    body,
  }) => new Promise((resolve, reject) => {
    // resolve();
    // return;
    const options = {
      socketPath: DOCKER_SOCKET_FILE,
      path: endpoint,
      method,
    };

    try {
      const callback = (res) => {
        log(`STATUS: ${res.statusCode}`);
        // log('===> res', res)

        const responses = [];

        res.setEncoding('utf8');
        res.on('data', (data) => {
          log('===> docker response data: ', data);
          responses.push(data);
          // if (data) resolve(data);
        });
        res.on('error', (data) => {
          log('===> ERROR docker response error: ', data);
          reject(data);
        });
        res.on('close', (data) => {
          if (!data) {
            log('nothing to see');
          }
          log('===> docker response close');
          resolve(responses);
        });
        // res.on('*', data => {
        //   log('===> dekho', data);
        // });
      };

      log('===> docker request data: ', options);
      const clientRequest = http.request(options, callback);
      clientRequest.end();
    }
    catch (e) {
      console.log('===> MAJOR ERROR ALERT', e);
      resolve();
    }
  });

  return {
    request,
  };
};

module.exports = makeSockerRequester;
