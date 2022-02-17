const Promise = require('bluebird');
const querystring = require('querystring');

const { getRichError } = require('@mimik/response-helper');

const { dockerDeploymentContainerEnv } = require('../../configuration/config');

const requestTypes = {
  NON_IMAGE_CONTAINER: 'non_image_container',
  CREATE_IMAGE: 'create_image',
  FETCH_IMAGE: 'fetch_image',
  CREATE_CONTAINER: 'create_container',
  START_CONTAINER: 'start_container',
  KILL_CONTAINER: 'kill_container',
  FETCH_CONTAINER: 'fetch_container',
  FETCH_ALL_CONTAINERS: 'fetch_all_containers',
  DELETE_CONTAINER: 'delete_container',
  UNIDENTIFIED: 'unidentified',
};

const identifyRequest = (nodeId, request, correlationId) => {
  try {
    const { endpoint, method, body } = request;
    if (!endpoint || !method) return Promise.resolve({ type: requestTypes.UNIDENTIFIED });

    if (endpoint.indexOf('/containers') < 0 && endpoint.indexOf('/images') < 0) {
      return Promise.resolve({
        type: requestTypes.NON_IMAGE_CONTAINER,
      });
    }

    if (endpoint.indexOf('/images') > -1) {
      if (method === 'POST' && endpoint.indexOf('/create') > -1) {
        const qs = endpoint.substring(endpoint.indexOf('?') + 1);
        const { fromImage, tag } = querystring.decode(qs);

        const fromImageSplit = fromImage.split('/');
        let user;
        let image;

        if (fromImageSplit.length > 1) [user, image] = fromImageSplit;
        else [image] = fromImageSplit;

        return Promise.resolve({
          type: requestTypes.CREATE_IMAGE,
          data: {
            user,
            image,
            tag,
          },
        });
      }

      if (method === 'GET') {
        const dataArr = endpoint.split('/');
        const [image, tag] = dataArr[4].split('@');
        return Promise.resolve({
          type: requestTypes.FETCH_IMAGE,
          data: {
            user: dataArr[3],
            image,
            tag,
          },
        });
      }
    }

    if (endpoint.indexOf('/containers') > -1) {
      if (method === 'POST') {
        if (endpoint.indexOf('/containers/create') > -1) {
          const qs = endpoint.substring(endpoint.indexOf('?') + 1);
          const [agreementId, name] = querystring.decode(qs).name.split('-');

          let parsedBody;
          try {
            parsedBody = JSON.parse(body);
          }
          catch (e) {
            parsedBody = body;
          }

          const env = {};
          const labels = {};
          const image = parsedBody.Image;
          let isGatewayDeployment = false;

          if (parsedBody.Env && Array.isArray(parsedBody.Env) && parsedBody.Env.length > 0) {
            parsedBody.Env.forEach((envEntry) => {
              const [envName, envValue] = envEntry.split('=');
              env[envName] = envValue;
            });

            isGatewayDeployment = parsedBody.Env.some((envVar) => envVar === dockerDeploymentContainerEnv);
          }

          return Promise.resolve({
            type: requestTypes.CREATE_CONTAINER,
            data: {
              agreementId,
              name,
              body,
              env,
              labels,
              image,
              isGatewayDeployment,
            },
          });
        }

        if (endpoint.indexOf('/start') > -1) {
          const containerId = endpoint.split('/')[2];

          return Promise.resolve({
            type: requestTypes.START_CONTAINER,
            data: {
              containerId,
            },
          });
        }

        if (endpoint.indexOf('/kill') > -1) {
          const containerId = endpoint.split('/')[2];

          return Promise.resolve({
            type: requestTypes.KILL_CONTAINER,
            data: {
              containerId,
            },
          });
        }
      }

      if (method === 'GET') {
        const endpointArgs = endpoint.split('/');
        if (endpoint.indexOf('/containers/json') > -1) {
          const qs = endpoint.substring(endpoint.indexOf('?') + 1);
          const { all } = querystring.decode(qs);
          return Promise.resolve({
            type: requestTypes.FETCH_ALL_CONTAINERS,
            data: {
              all: all === '1',
            },
          });
        }

        return Promise.resolve({
          type: requestTypes.FETCH_CONTAINER,
          data: {
            containerId: endpointArgs[2],
          },
        });
      }

      if (method === 'DELETE') {
        const containerId = (endpoint.split('/')[2]).split('?')[0];

        return Promise.resolve({
          type: requestTypes.DELETE_CONTAINER,
          data: {
            containerId,
          },
        });
      }
    }

    return Promise.resolve({
      type: requestTypes.UNIDENTIFIED,
    });
  }
  catch (error) {
    return Promise.reject(getRichError('System', 'Cannot identify incoming request', { nodeId, request, error }, null, 'error', correlationId));
  }
};

module.exports = {
  requestTypes,
  identifyRequest,
};
