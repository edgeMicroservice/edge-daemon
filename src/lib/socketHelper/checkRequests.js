const isGatewayDeploymentRequest = ({ body }) => {
  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  }
  catch (e) {
    return false;
  }

  let foundEnv = false;

  if (!parsedBody.Env || !Array.isArray(parsedBody.Env) || parsedBody.Env.length < 0) return foundEnv;

  parsedBody.Env.forEach((env) => {
    if (env.indexOf('HZN_DEPLOYMENT_LOCATION=gatewayNode') === 0) {
      foundEnv = true;
    }
  });
  return foundEnv;
};

const isContainerDeploymentRequest = ({ method, endpoint }) => {
  if (method !== 'POST') return false;

  if (!endpoint || endpoint.indexOf('/containers/create') !== 0) return false;

  return true;
};

const isContainerKillRequest = ({ method, endpoint }) => {
  if (method !== 'POST' && method !== 'DELETE') return false;

  if (!endpoint || endpoint.indexOf('/containers') !== 0) return false;

  if (endpoint.indexOf('/kill') < 0 && endpoint.indexOf('force') < 0) return false;

  return true;
};

module.exports = {
  isContainerDeploymentRequest,
  isContainerKillRequest,
  isGatewayDeploymentRequest,
};
