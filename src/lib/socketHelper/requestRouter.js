const { getRichError } = require('@mimik/response-helper');

const { requestTypes, identifyRequest } = require('./requestIdentifier');
const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../models/nodeDetailsModel');

const {
  convertContainerResponseForFetchOne,
  convertContainerResponseForFetchAll,
} = require('./converters/mdeployDockerResponseConverter');

const {
  request: dockerRequest,
  fetchContainerById: dockerFetchContainerById,
} = require('./requesters/dockerRequester');

const {
  createImage: mdeployCreateImage,
  createContainer: mdeployCreateContainer,
  fetchContainers: mdeployFetchContainers,
  fetchContainersById: mdeployFetchContainersById,
  deleteContainerById: mdeployDeleteContainerById,
} = require('./requesters/mdeployRequester');

const adjustContentLength = (dockerResponse) => {
  if (!dockerResponse.headers['content-length']) return dockerResponse;

  const updatedResponse = dockerResponse;
  delete updatedResponse['transfer-encoding'];
  updatedResponse.headers['content-length'] = updatedResponse.data[0].length;
  return updatedResponse;
};

const createImage = (nodeId, formattedRequest, { user, image, tag }, correlationId) => dockerRequest(nodeId, formattedRequest, correlationId)
  .then((dockerResponse) => {
    if (dockerResponse.status.code === 200) return dockerResponse;

    return mdeployCreateImage(nodeId, image, correlationId)
      .then(() => {
        const successfulDockerResponse = dockerResponse;
        successfulDockerResponse.status.code = 200;
        successfulDockerResponse.status.message = 'OK';
        delete successfulDockerResponse.headers['content-length'];
        successfulDockerResponse.headers['transfer-encoding'] = 'chunked';
        successfulDockerResponse.data = [
          `{"status":"Pulling from ${user}/${image}","id":"1.0.0"}`,
          `{"status":"Digest: ${tag}"}`,
          `{"status":"Pulling from ${user}/${image}","id":"latest"}`,
          `{"status":"Digest: ${tag}"}`,
          `{"status":"Status: Image is up to date for ${user}/${image}"}`,
        ];
        return successfulDockerResponse;
      })
      .catch(() => dockerResponse);
  });

const fetchAllContainers = (nodeId, formattedRequest, correlationId) => dockerRequest(nodeId, formattedRequest, correlationId)
  .then((dockerResponse) => mdeployFetchContainers(nodeId, correlationId)
    .then((mdeployResponse) => {
      let dockerContainers = JSON.parse(dockerResponse.data[0]);

      if (dockerContainers.length === 1 && Object.keys(dockerContainers[0]).length === 0) dockerContainers = [];

      const mdeployContainers = mdeployResponse.map((container) => convertContainerResponseForFetchAll(nodeId, container, correlationId));
      const allContainers = [...dockerContainers, ...mdeployContainers];

      const completeResponse = { ...dockerResponse };
      completeResponse.data = [`${JSON.stringify(allContainers)}\n`];
      return adjustContentLength(completeResponse, true);
    })
    .catch(() => dockerResponse));

const fetchContainerById = (nodeId, containerId, correlationId) => dockerFetchContainerById(nodeId, containerId, correlationId)
  .then((dockerResponse) => {
    if (Array.isArray(dockerResponse.data[0]) && dockerResponse.data[0].length > 0) {
      return dockerResponse;
    }
    return mdeployFetchContainersById(nodeId, containerId, correlationId)
      .then((foundContainer) => {
        if (!foundContainer) return dockerResponse;

        const convertedResponse = convertContainerResponseForFetchOne(nodeId, foundContainer, correlationId);
        const completeResponse = { ...dockerResponse };
        completeResponse.data = [`${JSON.stringify(convertedResponse)}\n`];
        completeResponse.status.code = 200;
        completeResponse.status.message = 'OK';
        return adjustContentLength(completeResponse);
      })
      .catch(() => dockerResponse);
  });

const createContainer = (
  nodeId,
  formattedRequest,
  {
    agreementId,
    name,
    body,
    isGatewayDeployment,
  },
  correlationId,
) => {
  if (isGatewayDeployment) return dockerRequest(nodeId, formattedRequest, correlationId);

  return mdeployCreateContainer(nodeId, agreementId, name, body, correlationId)
    .then((mdeployResponse) => {
      // TODO Create a separate function to get response object in this format
      const response = {};

      try {
        response.data = [`${JSON.stringify({
          Id: mdeployResponse.id,
          Warnings: [],
        })}\n`];
      }
      catch (e) {
        // TODO Handle this
      }

      response.headers = {
        'Accept-Encoding': 'gzip',
        Connection: 'close',
        'x-correlationId': correlationId,
      };

      response.status = {
        code: 201,
        message: 'Created',
      };

      return response;
    });
};

const startContainer = (nodeId, containerId, formattedRequest, correlationId) => dockerRequest(nodeId, formattedRequest, correlationId)
  .then((dockerResponse) => {
    if (dockerResponse.status.code !== 404) return dockerResponse;

    return mdeployFetchContainersById(nodeId, containerId, correlationId)
      .then((foundContainer) => {
        if (!foundContainer) return dockerResponse;

        const completeResponse = { ...dockerResponse };
        completeResponse.status.code = 204;
        completeResponse.status.message = 'No Content';
        completeResponse.data = [];
        return completeResponse;
      })
      .catch(() => dockerResponse);
  });

const killContainer = (nodeId, containerId, formattedRequest, correlationId) => dockerRequest(nodeId, formattedRequest, correlationId)
  .then((dockerResponse) => {
    if (dockerResponse.status.code !== 404) return dockerResponse;

    return mdeployFetchContainersById(nodeId, containerId, correlationId)
      .then((foundContainer) => {
        if (!foundContainer) return dockerResponse;

        const completeResponse = { ...dockerResponse };
        completeResponse.status.code = 204;
        completeResponse.status.message = 'No Content';
        completeResponse.data = [];
        return completeResponse;
      })
      .catch(() => dockerResponse);
  });

const routeRequest = (nodeId, formattedRequest, correlationId) => identifyRequest(nodeId, formattedRequest, correlationId)
  .then((identifiedRequest) => {
    const { type, data } = identifiedRequest;

    saveLog(nodeId, LOG_TYPE.INFO, SERVER_TYPE.EDGEDAEMON_FACING, 'Incoming request identified', { identifiedRequest, formattedRequest }, correlationId);

    switch (type) {
      case requestTypes.UNIDENTIFIED: // Docker Only
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.NON_IMAGE_CONTAINER: // Docker Only
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.CREATE_IMAGE:
        return createImage(nodeId, formattedRequest, data, correlationId);

      case requestTypes.FETCH_IMAGE: // TODO Update when service image posting mechanism is changed for HZN Exchange
        return dockerRequest(nodeId, formattedRequest, correlationId);

      case requestTypes.CREATE_CONTAINER:
        return createContainer(nodeId, formattedRequest, data, correlationId);

      case requestTypes.START_CONTAINER:
        return startContainer(nodeId, data.containerId, formattedRequest, correlationId);

      case requestTypes.KILL_CONTAINER:
        return killContainer(nodeId, data.containerId, formattedRequest, correlationId);

      case requestTypes.DELETE_CONTAINER:
        return mdeployDeleteContainerById(nodeId, data.containerId, correlationId)
          .catch(() => { })
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
