/* eslint-disable no-unused-vars */
const rp = require('request-promise');

const config = require('../../configuration/config');

const mdeployUrl = config.dependencies.MDEPLOY.url;
const { getCurrentNode } = require('../../external/jsonRPCRequests');
const makeLogger = require('./logger');

const makeHttpRequester = (nodeId) => {
  const { log } = makeLogger(nodeId);

  const request = ({
    method,
    host,
    endpoint,
    headers,
    body,
  }) => {
    log('===> request received on httpRequester', {
      method,
      host,
      endpoint,
      headers,
      body,
    });
    // return;
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
                endpoint: '/containers',
                method: 'POST',
                body: {
                  name: 'mreport-v1',
                  imageName: 'mreport-v1',
                  env: {
                    'MCM.BASE_API_PATH': '/mreport/v1',
                    'MCM.WEBSOCKET_SUPPORT': 'true',
                  },
                  imageHostNodeId: gatewayNode.nodeId,
                },
              },
            },
            json: true,
          };
          log('===> sending mdeploy post request', options);
          return rp(options)
            .then((data) => {
              log('===> success response from mdeploy', data.data);
            })
            .catch((error) => {
              log('===> failure response from mdeploy', error);
            });
        });
    }
  };

  return {
    request,
  };
};

module.exports = makeHttpRequester;
