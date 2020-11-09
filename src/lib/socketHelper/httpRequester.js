const rp = require('request-promise');

const config = require('../../configuration/config');
const { getCurrentNode } = require('../../external/jsonRPCRequests');
const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../models/anaxSocketModel');

const mdeployUrl = config.dependencies.MDEPLOY.url;

const makeHttpRequester = (nodeId) => {
  const request = ({
    method,
  }, correlationId) => {
    if (method === 'POST') {
      getCurrentNode()
        .then((gatewayNode) => {
          const options = {
            uri: `${mdeployUrl}/batchOps`,
            method: 'POST',
            body: {
              nodes: [
                nodeId,
              ],
              request: {
                endpoint: '/images',
                method: 'POST',
                body: {
                  nodeId: gatewayNode.nodeId,
                  imageId: `${config.edgeEngine.projectId}-mreport-v1`,
                },
              },
            },
            json: true,
          };
          saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.MDEPLOY_FACING, 'Requesting mdeploy', { options }, correlationId);
          return rp(options)
            .then((data) => {
              saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.MDEPLOY_FACING, 'Successful response received from mdeploy', { data }, correlationId);
            })
            .catch((error) => {
              saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.MDEPLOY_FACING, 'Error response received from mdeploy', { error }, correlationId);
            });
        })
        .catch((error) => {
          saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.MDEPLOY_FACING, 'Error occured while sending request to mdeploy', { error }, correlationId);
        });
    }
  };

  return {
    request,
  };
};

module.exports = makeHttpRequester;
