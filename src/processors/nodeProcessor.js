const nodeModel = require('../models/nodeModel');
const daemonModel = require('../models/daemonModel');

const getNodes = (correlationId) => nodeModel.getAllNodes(correlationId);

const getDaemon = (nodeId, correlationId) => daemonModel.getDaemonById(nodeId, correlationId);

module.exports = {
  getNodes,
  getDaemon,
};
