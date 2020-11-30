const Promise = require('bluebird');
const getPort = require('get-port');

const { updateAnaxState } = require('../../models/nodeModel');
const { initializeSocket } = require('../socketHelper');

const {
  hzn: {
    anaxContainersPortNumStart,
    anaxContainersPortNumEnd,
  },
  dockerSocketPath,
} = require('../../configuration/config');

const {
  purgeDocker,
  deployAnaxNode,
  undeployAnaxNode,
  registerAnaxNode,
  unregisterAnaxNode,
} = require('./scripts');

const {
  gatewayNodeIds,
  gatewayNodeIdsPortsMap,
  mdeployStatusValues,
  anaxStatusValues,
} = require('../../util/nodeUtil');

const {
  createPolicyFile,
  removePolicyFile,
} = require('./policy');

const timeoutBWAnaxInitializationAndRegisteration = 4000; // 4 seconds in ms
const timeoutBWAnaxUnregisterationAndTermination = 4000; // 4 seconds in ms

const deployRequests = {};

const deployAndRegisterAnaxNode = (nodeId, nodePort, nodeProperties, customdockerSocketPath, correlationId) => {
  if (deployRequests[nodeId]) {
    return Promise.resolve();
  }

  deployRequests[nodeId] = true;
  const shortenedNodeId = nodeId.substr(0, 16); // Anax does not support large nodeIds, left some space for flags

  return createPolicyFile(nodeId, nodeProperties)
    .then((policyFilePath) => deployAnaxNode(shortenedNodeId, nodePort, customdockerSocketPath, correlationId)
      .delay(timeoutBWAnaxInitializationAndRegisteration)
      .then(() => registerAnaxNode(shortenedNodeId, nodePort, policyFilePath, correlationId)
        .catch((error) => updateAnaxState(nodeId, { status: anaxStatusValues.UNCONFIGURED, nodePort })
          .then(() => {
            throw error;
          })))
      .then(() => updateAnaxState(nodeId, { status: anaxStatusValues.CONFIGURED, nodePort })))
    .finally(() => {
      delete deployRequests[nodeId];
      return removePolicyFile(nodeId, correlationId);
    });
};

const initializeGatewayNodes = () => {
  const nodeId = gatewayNodeIds.DOCKER;
  const nodePort = gatewayNodeIdsPortsMap[gatewayNodeIds.DOCKER];
  const nodeProperties = [
    {
      name: 'nodeType',
      value: 'gatewayNode',
    },
  ];
  return deployAndRegisterAnaxNode(nodeId, nodePort, nodeProperties, dockerSocketPath);
};

const initializeAnaxNodeForEdgeNode = (node, correlationId) => {
  if (node.mdeployStatus !== mdeployStatusValues.ACTIVE
    || (node.anaxState && node.anaxState.status === anaxStatusValues.CONFIGURED)
    || node.isGatewayNode) return Promise.resolve();

  const nodeProperties = [...node.attributes, ...node.characteristics];
  nodeProperties.push({
    name: 'nodeType',
    value: 'edgeNode',
  });

  return getPort({ port: getPort.makeRange(anaxContainersPortNumStart, anaxContainersPortNumEnd) })
    .then((availableNodePort) => initializeSocket(node.id)
      .then((customdockerSocketPath) => deployAndRegisterAnaxNode(node.id, availableNodePort, nodeProperties, customdockerSocketPath, correlationId)));
};

const terminateAnaxNodeForEdgeNode = (node, correlationId) => {
  if (!node.anaxState) return Promise.resolve();

  return unregisterAnaxNode(node.id, node.anaxState.nodePort, correlationId)
    .delay(timeoutBWAnaxUnregisterationAndTermination)
    .then(() => undeployAnaxNode(node.id, node.anaxState.nodePort, correlationId))
    .then(() => updateAnaxState(node.id, { status: anaxStatusValues.UNCONFIGURED }));
};

const removeAllAnaxNodes = () => purgeDocker();

module.exports = {
  removeAllAnaxNodes,
  initializeGatewayNodes,
  initializeAnaxNodeForEdgeNode,
  terminateAnaxNodeForEdgeNode,
};
