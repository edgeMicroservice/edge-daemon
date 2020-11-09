const nodeModel = require('../models/nodeModel');
const anaxSocketModel = require('../models/anaxSocketModel');

const getNodes = (mdeployStatuses, correlationId) => nodeModel.getAllNodes(correlationId)
  .then((nodes) => {
    if (!mdeployStatuses) return nodes;

    return nodes.filter((node) => mdeployStatuses.includes(node.mdeployStatus));
  });

const getNodeDetails = (nodeId, correlationId) => nodeModel.getNodeById(nodeId, correlationId)
  .then((node) => anaxSocketModel.findAnaxSocketById(nodeId, correlationId)
    .then((nodeDetails) => ({ ...node, anaxSocketDetails: { ...nodeDetails } })));

module.exports = {
  getNodes,
  getNodeDetails,
};
