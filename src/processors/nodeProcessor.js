const nodeModel = require('../models/nodeModel');
const daemonModel = require('../models/daemonModel');

const getNodes = (mdeployStatuses, correlationId) => nodeModel.getAllNodes(correlationId)
  .then((nodes) => {
    console.log('===> mdeployStatuses', mdeployStatuses);
    if (!mdeployStatuses) return nodes;

    let mdeployStatusArr;
    if (!Array.isArray(mdeployStatuses)) mdeployStatusArr = [mdeployStatuses];
    else mdeployStatusArr = mdeployStatuses;

    return nodes.filter((node) => mdeployStatusArr.includes(node.mdeployStatus));
  });

const getDaemon = (nodeId, correlationId) => daemonModel.getDaemonById(nodeId, correlationId);

module.exports = {
  getNodes,
  getDaemon,
};
