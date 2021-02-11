const Promise = require('bluebird');

const logger = require('@bananabread/sumologic-winston-logger');
const { getRichError } = require('@bananabread/response-helper');

const {
  socketLogsMaxTotal,
  consoleLogSocketCommunication,
} = require('../configuration/config');

const edgeSockets = {};

const LOG_TYPE = {
  ERROR: 'error',
  INFO: 'info',
};

const SERVER_TYPE = {
  EDGEDAEMON_FACING: 'edgeDaemon facing',
  DOCKER_PROXY_FACING: 'docker facing',
  MDEPLOY_FACING: 'mdeploy facing',
};

const saveEdgeSocket = (nodeId) => {
  if (!edgeSockets[nodeId]) {
    edgeSockets[nodeId] = { logs: [] };
  }

  return Promise.resolve(edgeSockets[nodeId]);
};

const findEdgeSocketById = (nodeId) => Promise.resolve(edgeSockets[nodeId]);

const saveLog = (nodeId, level, serverType, message, metadata, correlationId) => saveEdgeSocket(nodeId, correlationId)
  .then((edgeSocket) => {
    if (edgeSocket.logs.length > socketLogsMaxTotal - 1) edgeSocket.logs.shift();
    const logMessage = `${serverType}: ${message}`;

    if (consoleLogSocketCommunication) {
      let loggerMetdata = { correlationId };
      if (metadata) loggerMetdata = { ...loggerMetdata, ...metadata };

      if (level !== LOG_TYPE.ERROR) logger.debug(logMessage, loggerMetdata);
      else logger.error(logMessage, loggerMetdata);
    }

    const logObj = {
      level,
      message: logMessage,
      timestamp: (new Date()).toUTCString(),
      correlationId,
    };
    if (metadata) logObj.metadata = metadata;
    edgeSocket.logs.push(logObj);
  });

const getEdgeSocketById = (id, correlationId) => findEdgeSocketById(id)
  .then((node) => {
    if (node) return node;
    throw getRichError('System', 'Could not get node in nodeDetail', { id }, null, 'error', correlationId);
  });

const deleteEdgeSocketById = (id) => Promise.resolve()
  .then(() => {
    delete edgeSockets[id];
  });

module.exports = {
  LOG_TYPE,
  SERVER_TYPE,
  saveLog,
  getEdgeSocketById,
  findEdgeSocketById,
  deleteEdgeSocketById,
};
