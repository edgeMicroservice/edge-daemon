const Promise = require('bluebird');
const getPort = require('get-port');

const { getAllNodes, updateAnaxState } = require('../../models/nodeModel');
const {
  purgeDocker,
  deployAndRegisterAnaxNode,
} = require('./scripts');
const {
  gatewayNodeIds,
  gatewayNodeIdsPortsMap,
  mdeployStatusValues,
  anaxStatusValues,
} = require('../../util/nodeUtil');

const initializeGatewayNodes = () => deployAndRegisterAnaxNode(gatewayNodeIds.DOCKER, gatewayNodeIdsPortsMap[gatewayNodeIds.DOCKER])
  .then(() => deployAndRegisterAnaxNode(gatewayNodeIds.EDGE_ENGINE, gatewayNodeIdsPortsMap[gatewayNodeIds.EDGE_ENGINE]));

const initializeAnaxNodesForEdgeNodes = () => getAllNodes()
  .then((nodes) => Promise.mapSeries(nodes, (node) => {
    if (node.mdeployStatus !== mdeployStatusValues.ACTIVE
      || (node.anaxState && node.anaxState.status === anaxStatusValues.CONFIGURED)
      || node.isGatewayNode) return Promise.resolve();

    return getPort({ port: getPort.makeRange(8200, 8300) })
      .then((port) => deployAndRegisterAnaxNode(node.id, port)
        .then(() => updateAnaxState(node.id, { status: anaxStatusValues.CONFIGURED, port })));
  }));

const removeAllAnaxNodes = () => purgeDocker();

module.exports = {
  removeAllAnaxNodes,
  initializeGatewayNodes,
  initializeAnaxNodesForEdgeNodes,
};
