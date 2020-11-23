/* eslint-disable no-unused-vars */
const { getRichError } = require('@bananabread/response-helper');

const { requestTypes, identifyRequest } = require('./requestIdentifier');
const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../models/anaxSocketModel');

const {
  converContainerResponse,
} = require('./converters/mdeployDockerResponseConverter');

const {
  request: dockerRequest,
  fetchContainerById: dockerFetchContainerById,
} = require('./requesters/dockerRequester');

const {
  createContainer: mdeployCreateContainer,
  fetchContainers: mdeployFetchContainers,
  deleteContainerById: mdeployDeleteContainerById,
} = require('./requesters/mdeployRequester');

const imageCache = {}; // { nodeId: [ { user, image, tag } ] }

const createImage = (nodeId, formattedRequest, data, correlationId) => dockerRequest(nodeId, formattedRequest, correlationId)
  .then(() => {

  });

const fetchAllContainers = (nodeId, formattedRequest, correlationId) => dockerRequest(nodeId, formattedRequest, correlationId)
  .then((dockerResponse) => mdeployFetchContainers(nodeId, correlationId)
    .then((mdeployResponse) => {
      const dockerContainers = JSON.parse(dockerResponse.data[0]);
      const mdeployContainers = mdeployResponse.map((container) => converContainerResponse(nodeId, container, correlationId));
      const allContainers = [...dockerContainers, ...mdeployContainers];

      const completeResponse = { ...dockerResponse };
      completeResponse.data = [`${JSON.stringify(allContainers)}\n`];
      return completeResponse;
    }));

const fetchContainerById = (nodeId, containerId, correlationId) => dockerFetchContainerById(nodeId, containerId, correlationId)
  .then((dockerResponse) => {
    if (Array.isArray(dockerResponse.data[0]) && dockerResponse.data[0].length > 0) {
      return dockerResponse;
    }
    return mdeployFetchContainers(nodeId, correlationId)
      .then((mdeployResponse) => {
        const foundContainer = mdeployResponse.find((container) => container.id === containerId);

        if (!foundContainer) return dockerResponse;

        const convertedResponse = converContainerResponse(nodeId, foundContainer, correlationId);
        const completeResponse = { ...dockerResponse };
        completeResponse.data = [`${JSON.stringify(convertedResponse)}\n`];
        return completeResponse;
      });
  });

const createContainer = (
  nodeId,
  formattedRequest,
  { isGatewayDeployment },
  correlationId,
) => {

};

const routeRequest = (nodeId, formattedRequest, correlationId) => identifyRequest(nodeId, formattedRequest, correlationId)
  .then((identifiedRequest) => {
    const { type, data } = identifiedRequest;
    saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.ANAX_FACING, 'Incoming request identified', { identifiedRequest, formattedRequest }, correlationId);

    switch (type) {
      case requestTypes.UNIDENTIFIED:
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.NON_IMAGE_CONTAINER:
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.FETCH_IMAGE:
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.CREATE_IMAGE:
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.CREATE_CONTAINER:
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.START_CONTAINER: // Docker Only
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.KILL_CONTAINER: // Docker Only
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.DELETE_CONTAINER:
        return mdeployDeleteContainerById(nodeId, data.containerId, correlationId)
          .then(() => dockerRequest(nodeId, formattedRequest, correlationId));

      case requestTypes.FETCH_ALL_CONTAINERS:
        return fetchAllContainers(nodeId, formattedRequest, correlationId);

      case requestTypes.FETCH_CONTAINER:
        return fetchContainerById(nodeId, data.containerId, correlationId);

      default:
        return Promise.reject(getRichError('System', 'Unknown identification for request received', { nodeId, identifiedRequest }, null, 'error', correlationId));
    }
  });

module.exports = {
  routeRequest,
};
