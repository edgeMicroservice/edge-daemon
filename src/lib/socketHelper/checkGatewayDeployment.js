const isGatewayDeploymentRequest = ({ method, endpoint, body }) => {
  if (method !== 'POST') return false;

  if (!endpoint || endpoint.indexOf('/containers/create') !== 0) return false;

  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  }
  catch (e) {
    return false;
  }

  let foundEnv = false;
  parsedBody.Env.forEach((env) => {
    if (env.indexOf('HZN_DEPLOYMENT_LOCATION=gatewayNode') === 0) {
      foundEnv = true;
    }
  });
  return foundEnv;
};

module.exports = {
  isGatewayDeploymentRequest,
};
