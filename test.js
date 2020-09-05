const http = require('http');
const Promise = require('bluebird');
const { response } = require('express');

const SOCKET_PATH = '/var/run/docker_new.sock';

endpoint = '/v1.40/containers/json'
method = 'GET'

// new Promise((resolve, reject) => {
  const options = {
    socketPath: SOCKET_PATH,
    path: `http:/${endpoint}`,
    method,
  };

  const callback = res => {
    console.log(`STATUS: ${res.statusCode}`);
    // console.log('===> dekho', res)
    res.setEncoding('utf8');
    res.on('data', data => {
      console.log('===> docker response data: ', data)
      // resolve(data);
    });
    res.on('error', data => {
      console.error('===> docker response error: ', data)
      // reject(data)
    });
    res.on('close', data => {
      if (!data) {
        console.log('nothing to see')
      }
      console.error('===> docker response close: ', data)
      // console.log('===> docker response object on close:', res)
      // resolve()
    })
  };

  console.log('===> docker request data: ', options)
  try {
    const clientRequest = http.request(options, callback);
    clientRequest.end();
  } catch (error) {
    console.log('===> unknown error occured while sending docker request: ', error)
  }
// })
