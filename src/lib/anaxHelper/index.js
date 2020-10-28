const Promise = require('bluebird');
const getPort = require('get-port');

const {
  hzn: {
    anaxContainersPortNumStart,
    anaxContainersPortNumEnd,
  },
  development: {
    deployServicesOnDocker,
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
const { initializeSocket } = require('../socketHelper');

const initializeGatewayNodes = () => {
  const nodeId = gatewayNodeIds.DOCKER;
  const nodePort = gatewayNodeIdsPortsMap[gatewayNodeIds.DOCKER];
  const properties = [
    {
      name: 'nodeType',
      value: 'gatewayNode',
    },
  ];
  return createPolicyFile(nodeId, properties)
    .then((policyFilePath) => deployAndRegisterAnaxNode(nodeId, nodePort, policyFilePath));
};

const initializeAnaxNodesForEdgeNodes = (correlationId) => getAllNodes()
  .then((nodes) => Promise.mapSeries(nodes, (node) => {
    if (node.mdeployStatus !== mdeployStatusValues.ACTIVE
      || (node.anaxState && node.anaxState.status === anaxStatusValues.CONFIGURED)
      || node.isGatewayNode) return Promise.resolve();

    const properties = [...node.attributes, ...node.characteristics];
    properties.push({
      name: 'nodeType',
      value: 'edgeNode',
    });

    // Anax does not support large nodeIds, left some space for flags
    const shortenedNodeId = node.id.substr(0, 16);
    return createPolicyFile(node.id, properties).then((policyFilePath) => getPort({ port: getPort.makeRange(anaxContainersPortNumStart, anaxContainersPortNumEnd) })
      .then((availableNodePort) => (() => {
        if (deployServicesOnDocker) return Promise.resolve();
        return initializeSocket(node.id);
      })()
        .then((dockerSocketFilePath) => {
          console.log('===> dockerSocketFilePath', dockerSocketFilePath);
          return deployAndRegisterAnaxNode(shortenedNodeId, availableNodePort, policyFilePath, dockerSocketFilePath, correlationId)
            .then(() => updateAnaxState(node.id, { status: anaxStatusValues.CONFIGURED, availableNodePort }));
        })));
  }));

const removeAllAnaxNodes = () => purgeDocker();

module.exports = {
  removeAllAnaxNodes,
  initializeGatewayNodes,
  initializeAnaxNodesForEdgeNodes,
};
