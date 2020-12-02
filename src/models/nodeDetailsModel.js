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

const checkIfValidEdgeSocket = (edgeSocket, correlationId) => Promise.resolve()
  .then(() => {
    if (!edgeSocket) {
      throw getRichError('System', 'Invalid edgeSocket', { edgeSocket }, null, 'error', correlationId);
    }
    if (!edgeSocket.logs || !Array.isArray(edgeSocket.logs)) {
      throw getRichError('System', 'Invalid edgeSocket, logs array not present', { edgeSocket }, null, 'error', correlationId);
    }
  });

const saveEdgeSocket = (nodeId, edgeSocket, correlationId) => checkIfValidEdgeSocket(edgeSocket, correlationId)
  .catch((err) => {
    throw getRichError('System', 'Could not save edgeSocket, invalid format', { edgeSocket }, err, 'error', correlationId);
  })
  .then(() => {
    if (edgeSockets[nodeId]) {
      throw getRichError('System', 'Could not save edgeSocket, edgeSocket already exists', { edgeSocket }, null, 'error', correlationId);
    }
    edgeSockets[nodeId] = edgeSocket;
    return edgeSocket;
  });

const findEdgeSocketById = (nodeId) => Promise.resolve(edgeSockets[nodeId]);

const saveLog = (nodeId, level, serverType, message, metadata, correlationId) => findEdgeSocketById(nodeId)
  .then((edgeSocket) => {
    if (edgeSocket) return edgeSocket;
    return saveEdgeSocket(nodeId, { logs: [] }, correlationId);
  })
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
  saveEdgeSocket,
  getEdgeSocketById,
  findEdgeSocketById,
  deleteEdgeSocketById,
};
