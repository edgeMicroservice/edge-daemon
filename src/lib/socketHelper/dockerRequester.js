/* eslint-disable no-unused-vars */
const http = require('http');
const Promise = require('bluebird');
const { response } = require('express');

const makeLogger = require('./logger');

const makeDockerRequester = (nodeId) => {
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
      path: '/containers/create?name=9972b90575d30a16d2cc20cc1d1a5f9c95e3ce65b0cb16e6475c2d24b12eee51-mreport',
      method,
      body,
      host,
      headers,
    };

    const responses = [];
    try {
      const callback = (res) => {
        // log(`STATUS: ${res.statusCode}`);
        // log('===> res', res)
        // console.log('===> res', res);
        // console.log('===> res.headers', res.headers);

        res.setEncoding('utf8');
        res.on('data', (data) => {
          // log('===> docker response data: ', data);
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
          // log('===> ERROR docker response error: ', data);
          reject(data);
        });
        res.on('close', (data) => {
          // if (!data) {
          //   log('nothing to see');
          // }
          // log('===> docker response close');
          resolve(responses);
        });
        // res.on('*', data => {
        //   log('===> dekho', data);
        // });
      };

      // log('===> docker request data: ', options);
      const clientRequest = http.request(options, callback);
      clientRequest.end();
    }
    catch (e) {
      console.log('===> MAJOR ERROR ALERT', e);
      reject();
    }
  });

  return {
    request,
  };
};

module.exports = makeDockerRequester;
