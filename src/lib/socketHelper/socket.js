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

const { formatToJson } = require('./httpJson');

const makeLogger = require('./logger');

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
      log('Connection acknowledged.');

      const self = Date.now();
      connections[self] = (stream);

      stream.on('end', () => {
        log('Client disconnected.');
        delete connections[self];
      });

      stream.on('error', (err) => {
        console.log('===> error on incoming socket stream: ', err);
      });

      stream.on('data', (msg) => {
        const msgStr = msg.toString();

        log('Request received on socket:', { msgStr });

        const formattedRequest = formatToJson(msgStr);

        // makeHttpRequester(nodeId).request(formattedRequest);

        setTimeout(() => {
          makeSockerRequester(nodeId).request(formattedRequest)
            .then((data) => {
              try {
                log('in then: ', data);
                if (data) {
                  log('===> 1');
                  stream.write(data);
                }
                else {
                  log('===> 2');
                  stream.emit('close');
                }
              }
              catch (error) {
                console.log('===> error occured while writing data to stream', error);
              }
            })
            .catch((data) => {
              log('in catch');
              stream.write(data);
              stream.emit('close');
            });
        }, 3000);
      });
    })
      .listen(socket)
      .on('connection', (sct) => {
        log('Client connected.');
        // log('Sending boop.');
        // sct.write('__boop');
        // log(Object.keys(socket));
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
