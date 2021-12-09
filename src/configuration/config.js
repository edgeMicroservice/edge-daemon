const { setConfig } = require('@bananabread/configuration');
const pack = require('../../package.json');

/**
 *
 * edgedaemon Configuration.
 *
 * @function config
 * @return {object} configuration - Server configuration.
 * @description The following environment variables are needed to configure edgedaemon:
 *
 * | Env variable name | Description | Default | Comments |
 * | ----------------- | ----------- | ------- | -------- |
 * | EDGE_ENGINE_URL | Url for the edgeEngine (gateway) | http://localhost:8083 |
 * | EDGE_ENGINE_PROJECT_ID | mimik developer project id | | should be same for mdeploy
 * | EDGE_ENGINE_MDEPLOY_ENDPOINT | mdeploy endpoint | /mdeploy/v1 |
 * | MDEPLOY_APIKEY | to to use to reach mdeploy | |
 * | SOCKETS_DIR | Directory to store/create unix sockets in | /var/tmp/oh/sockets |
 * | DOCKER_SOCKET_PATH | Path to the docker daemon socket | /var/run/docker.sock |
 * | SOCKET_LOGS_MAX_TOTAL | Maximum number of total socket communication logs persisted and served using api per node socket | 100 | logs are kept by newest (older gets deleted if max total number is hit)
 * | CONSOLE_LOG_SOCKET_COMMUNICATION | Whether to have socket communincation logs logged in the service console  | no | to enable set to: yes
 * | DOCKER_DEPLOYMENT_CONTAINER_ENV | Env var to add to docker container during deployment to set deployment location as docker instead of mdeploy | HZN_DEPLOYMENT_LOCATION=gatewayNode |
 *
 * These values are on top of what is needed in the [configuration](https://bitbucket.org/mimiktech/configuration) library.
 *
 * The api is in [swaggerhub](https://app.swaggerhub.com/apis/mimik/edgedaemon)
 *
 */
module.exports = (() => {
  const edgeEngineUrl = process.env.EDGE_ENGINE_URL || 'http://localhost:8083';
  const edgeEngineProjectId = process.env.EDGE_ENGINE_PROJECT_ID;
  const edgeEngineMdeployEndpoint = process.env.EDGE_ENGINE_MDEPLOY_ENDPOINT || '/mdeploy/v1';

  const configuration = setConfig(pack, {
    dependencies: {
      MDEPLOY: {
        url: `${edgeEngineUrl}/${edgeEngineProjectId}${edgeEngineMdeployEndpoint}`,
        apiKey: process.env.MDEPLOY_APIKEY,
      },
    },
    custom: {
      edgeEngine: {
        url: edgeEngineUrl,
        projectId: edgeEngineProjectId,
        mdeployEndpoint: edgeEngineMdeployEndpoint,
      },
      socketsDir: process.env.SOCKETS_DIR || '/var/tmp/oh/sockets',
      dockerSocketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
      socketLogsMaxTotal: parseInt(process.env.SOCKET_LOGS_MAX_TOTAL, 10) || 100,
      consoleLogSocketCommunication: process.env.CONSOLE_LOG_SOCKET_COMMUNICATION === 'yes',
      dockerDeploymentContainerEnv: process.env.DOCKER_DEPLOYMENT_CONTAINER_ENV || 'HZN_DEPLOYMENT_LOCATION=gatewayNode',
      containerLabelPrefix: process.env.CONTAINER_LABEL_PREFIX || 'openhorizon.anax',
    },
  });

  return configuration;
})();
