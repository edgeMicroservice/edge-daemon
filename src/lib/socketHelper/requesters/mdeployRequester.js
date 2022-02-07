const { rpRetry } = require('@mimik/request-retry');

const config = require('../../../configuration/config');
const { getCurrentNode } = require('../../../external/jsonRPCRequests');
const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../../models/nodeDetailsModel');

const mdeployUrl = config.dependencies.MDEPLOY.url;
const { apiKey } = config.dependencies.MDEPLOY;
const { projectId } = config.edgeEngine;

const MDEPLOY_ENDPOINTS = {
  IMAGES: '/images',
  CONTAINERS: '/containers',
  BATCHOPS: '/batchOps',
};

const request = (
  nodeId,
  {
    method,
    endpoint,
    body,
  },
  correlationId,
) => {
  const options = {
    method: 'POST',
    headers: {
      'x-correlation-id': correlationId,
      apiKey,
    },
    url: `${mdeployUrl}${MDEPLOY_ENDPOINTS.BATCHOPS}`,
    data: {
      nodes: [
        nodeId,
      ],
      request: {
        endpoint,
        method,
      },
    },
  };
  if (body) options.data.request.body = body;

  saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.MDEPLOY_FACING, 'Requesting mdeploy', { options }, correlationId);
  return rpRetry(options)
    .then((response) => {
      if (!response.data || !Array.isArray(response.data) || !response.data[0] || response.data[0].responseType !== 'success') {
        throw new Error(response);
      }
      const { data } = response.data[0].responseBody;
      saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.MDEPLOY_FACING, 'Successful response received from mdeploy', { data }, correlationId);
      return data;
    })
    .catch((error) => {
      saveLog(nodeId, LOG_TYPE.ERROR, SERVER_TYPE.MDEPLOY_FACING, 'Error response received from mdeploy', { error }, correlationId);
      throw new Error();
    });
};

const fetchImages = (nodeId, correlationId) => request(
  nodeId,
  {
    method: 'GET',
    endpoint: MDEPLOY_ENDPOINTS.IMAGES,
  },
  correlationId,
);

const createImage = (nodeId, image, correlationId) => getCurrentNode(correlationId)
  .then((gatewayNode) => request(
    nodeId,
    {
      method: 'PUT',
      endpoint: MDEPLOY_ENDPOINTS.IMAGES,
      body: {
        nodeId: gatewayNode.nodeId,
        imageId: `${projectId}-${image}-v1`,
      },
    },
    correlationId,
  ));

const createContainer = (nodeId, agreementId, name, dockerRequestBody, correlationId) => getCurrentNode(correlationId)
  .then((gatewayNode) => {
    const env = {
      'MCM.BASE_API_PATH': `/${name}/v1`,
    };

    const parsedBody = JSON.parse(dockerRequestBody);

    if (parsedBody.Env) {
      parsedBody.Env.forEach((envEntry) => {
        const [envName, envValue] = envEntry.split('=');
        env[envName] = envValue;
      });
    }

    return request(
      nodeId,
      {
        method: 'PUT',
        endpoint: MDEPLOY_ENDPOINTS.CONTAINERS,
        body: {
          env,
          labels: parsedBody.Labels,
          metadata: parsedBody,
          name: `${agreementId.substr(0, 12)}-${name}`,
          imageId: `${projectId}-${name}-v1`,
          imageHostNodeId: gatewayNode.nodeId,
        },
      },
      correlationId,
    );
  });

const deleteContainerById = (nodeId, containerId, correlationId) => request(
  nodeId,
  {
    method: 'DELETE',
    endpoint: `${MDEPLOY_ENDPOINTS.CONTAINERS}/${containerId}`,
  },
  correlationId,
);

// TODO reimplement this method using GET /nodes endpoint on mdeploy
const fetchContainers = (nodeId, correlationId) => request(
  nodeId,
  {
    method: 'GET',
    endpoint: MDEPLOY_ENDPOINTS.CONTAINERS,
  },
  correlationId,
);

const fetchContainersById = (nodeId, containerId, correlationId) => fetchContainers(nodeId, correlationId)
  .then((containers) => containers.find((container) => container.id === containerId));

module.exports = {
  fetchImages,
  createImage,
  createContainer,
  fetchContainers,
  fetchContainersById,
  deleteContainerById,
};
