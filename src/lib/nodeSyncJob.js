const Promise = require('bluebird');
const uuid = require('uuid');

const { getRichError } = require('@bananabread/response-helper');
const logger = require('@bananabread/sumologic-winston-logger');

const { saveAndReplaceNode } = require('../models/nodeModel');

const { nodeSync } = require('../configuration/config');
const {
  getNodes,
  getClient,
  getClientForExternalNode,
  clientStatusValues,
} = require('../external/mdeployRequests');
const { mdeployStateValues } = require('../util/nodeUtil');

const syncNodes = () => {
  const correlationId = uuid.v4();
  logger.debug('Starting nodeSyncJob', { correlationId });
  return getNodes(correlationId)
    .then((foundNodes) => getClientForExternalNode(foundNodes.map((foundNode) => foundNode.id), correlationId)
      .catch((error) => {
        throw getRichError('System', 'Error occured while fetching nodes client status using super mdeploy', { error }, null, 'error');
      })
      .then((responses) => {
        const nodes = [];
        foundNodes.forEach((foundNode) => {
          const node = {
            id: foundNode.id,
            attributes: foundNode.attributes,
            characteristics: foundNode.characteristics,
          };
          responses.forEach((response) => {
            if (response.nodeId === foundNode.id) {
              if (response.responseBody && response.responseBody.data) {
                if (response.responseBody.data.status === clientStatusValues.ACTIVE) {
                  node.mdeployStatus = mdeployStateValues.ACTIVE;
                }
                else {
                  node.mdeployStatus = mdeployStateValues.INACTIVE;
                }
              }
              else {
                logger.debug(`Setting node mdeployState to: ${mdeployStateValues.NOT_FOUND}`, { nodeId: foundNode.id, correlationId, response });
                node.mdeployStatus = mdeployStateValues.NOT_FOUND;
              }
            }
          });
          nodes.push(node);
        });
        return nodes;
      })
      .then((nodes) => Promise.map(nodes, (node) => saveAndReplaceNode(node)
        .catch((error) => ({
          error,
        }))))
      .then((results) => {
        const errorsFound = results.some((result) => result.error !== undefined);
        if (errorsFound) throw new Error();
      }))
    .then(() => {
      logger.debug('Completed nodeSyncJob', { correlationId });
    })
    .catch(() => {
      logger.debug('Completed nodeSyncJob with errors', { correlationId });
    });
};

const start = () => getClient()
  .catch((error) => {
    throw getRichError('System', 'Could not connect to super mdeploy, error occured while fetching client status', { error }, null, 'error');
  })
  .then((data) => {
    if (data.status === clientStatusValues.INACTIVE) {
      throw getRichError('System', 'Super mdeploy client is not activated', null, null, 'error');
    }
  })
  .then(() => {
    setInterval(syncNodes, nodeSync.jobInterval * 1000);
  });

module.exports = {
  start,
};
