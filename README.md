<a name="config"></a>

## config() ⇒ <code>object</code>
The following environment variables are needed to configure edgedaemon:

| Env variable name | Description | Default | Comments |
| ----------------- | ----------- | ------- | -------- |
| EDGE_ENGINE_URL | Url for the edgeEngine (gateway) | http://localhost:8083 |
| EDGE_ENGINE_PROJECT_ID | mimik developer project id | | should be same for mdeploy
| EDGE_ENGINE_MDEPLOY_ENDPOINT | mdeploy endpoint | /mdeploy/v1 |
| SOCKETS_DIR | Directory to store/create unix sockets in | /var/tmp/oh/sockets |
| DOCKER_SOCKET_PATH | Path to the docker daemon socket | /var/run/docker.sock |
| SOCKET_LOGS_MAX_TOTAL | Maximum number of total socket communication logs persisted and served using api per node socket | 100 | logs are kept by newest (older gets deleted if max total number is hit)
| CONSOLE_LOG_SOCKET_COMMUNICATION | Whether to have socket communincation logs logged in the service console  | no | to enable set to: yes
| DOCKER_DEPLOYMENT_CONTAINER_ENV | Env var to add to docker container during deployment to set deployment location as docker instead of mdeploy | HZN_DEPLOYMENT_LOCATION=gatewayNode |

These values are on top of what is needed in the [configuration](https://bitbucket.org/mimiktech/configuration) library.

The api is in [swaggerhub](https://app.swaggerhub.com/apis/mimik/edgedaemon)

**Kind**: global function  
**Returns**: <code>object</code> - configuration - Server configuration.  
