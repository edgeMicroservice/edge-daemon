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
 * | NODE_SYNC_JOB_INTERVAL | Interval to check for updates in edge nodes | 5 | in seconds
 * | EDGE_ENGINE_URL | edgeEngine url | http://localhost:8083 |
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
        audience: process.env.MDEPLOY_AUDIENCE,
      },
    },
    custom: {
      nodeSync: {
        jobInterval: parseInt(process.env.NODE_SYNC_JOB_INTERVAL, 10) || 10, // in seconds
      },
      edgeEngine: {
        url: edgeEngineUrl,
        projectId: edgeEngineProjectId,
        mdeployEndpoint: edgeEngineMdeployEndpoint,
      },
    },
  });

  return configuration;
})();
