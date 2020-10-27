const nodeModel = require('../models/nodeModel');
const daemonModel = require('../models/daemonModel');

const getNodes = (mdeployStatuses, correlationId) => nodeModel.getAllNodes(correlationId)
  .then((nodes) => {
    console.log('===> mdeployStatuses', mdeployStatuses);
    if (!mdeployStatuses || mdeployStatuses.length < 1) {
      return nodes;
    }

    return nodes.filter((node) => mdeployStatuses.includes(node.mdeployStatus));
  });

const getDaemon = (nodeId, correlationId) => daemonModel.getDaemonById(nodeId, correlationId);

module.exports = {
  getNodes,
  getDaemon,
};
