const { getRichError } = require('@mimik/response-helper');

const nodeModel = require('../models/nodeModel');
const nodeDetailsModel = require('../models/nodeDetailsModel');

const {
  initializeSocket,
  terminateSocket,
} = require('../lib/socketHelper');

const createNode = (newNode, correlationId) => {
  const node = newNode;

  return nodeModel.findNodeById(node.id, correlationId)
    .then((foundNode) => {
      if (foundNode) {
        throw getRichError('Conflict', 'Could not save node, node already exists', { node }, null, 'error', correlationId);
      }

      return initializeSocket(node.id, correlationId)
        .then((edgeSocketPath) => {
          node.edgeSocketPath = edgeSocketPath;
          return nodeModel.saveNode(node, correlationId);
        });
    });
};

const getNodes = (correlationId) => nodeModel.getAllNodes(correlationId);

const getNodeDetails = (id, correlationId) => nodeModel.getNodeById(id, correlationId)
  .then((node) => nodeDetailsModel.findEdgeSocketById(id, correlationId)
    .then((nodeDetails) => {
      const responseData = { ...node, ...nodeDetails };
      if (responseData.logs) {
        responseData.logs = [...responseData.logs];
        responseData.logs.reverse();
      }
      return responseData;
    }));

const deleteNode = (id, correlationId) => terminateSocket(id, correlationId)
  .then(() => nodeModel.deleteNodeById(id, correlationId))
  .then(() => nodeDetailsModel.deleteEdgeSocketById())
  .then(() => ({ id }));

module.exports = {
  createNode,
  getNodes,
  getNodeDetails,
  deleteNode,
};
