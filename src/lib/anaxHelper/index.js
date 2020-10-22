const Promise = require('bluebird');
const getPort = require('get-port');

const {
  hzn: {
    anaxContainersPortNumStart,
    anaxContainersPortNumEnd,
  },
} = require('../../configuration/config');
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
const { createPolicyFile } = require('./policy');
const { getAllNodes, updateAnaxState } = require('../../models/nodeModel');

const initializeGatewayNodes = () => deployAndRegisterAnaxNode(gatewayNodeIds.DOCKER, gatewayNodeIdsPortsMap[gatewayNodeIds.DOCKER]);

const initializeAnaxNodesForEdgeNodes = (correlationId) => getAllNodes()
  .then((nodes) => Promise.mapSeries(nodes, (node) => {
    if (node.mdeployStatus !== mdeployStatusValues.ACTIVE
      || (node.anaxState && node.anaxState.status === anaxStatusValues.CONFIGURED)
      || node.isGatewayNode) return Promise.resolve();

    const properties = [...node.attributes, ...node.characteristics];
    // Anax does not support large nodeIds, left some space for flags
    const shortenedNodeId = node.id.substr(0, 16);
    return createPolicyFile(node.id, properties).then((filePath) => getPort({ port: getPort.makeRange(anaxContainersPortNumStart, anaxContainersPortNumEnd) })
      .then((port) => deployAndRegisterAnaxNode(shortenedNodeId, port, filePath, correlationId)
        .then(() => updateAnaxState(node.id, { status: anaxStatusValues.CONFIGURED, port }))));
  }));

const removeAllAnaxNodes = () => purgeDocker();

module.exports = {
  removeAllAnaxNodes,
  initializeGatewayNodes,
  initializeAnaxNodesForEdgeNodes,
};
