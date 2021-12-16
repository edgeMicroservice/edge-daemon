const { rpRetry } = require('@mimik/request-retry');

const config = require('../configuration/config');

const jsonRPCUrl = `${config.edgeEngine.url}/jsonrpc/v1`;

const getCurrentNode = (correlationId) => rpRetry({
  method: 'POST',
  headers: {
    'x-correlation-id': correlationId,
  },
  url: jsonRPCUrl,
  data: {
    jsonrpc: '2.0',
    method: 'getMe',
    params: [''],
    id: 1,
  },
})
  .then((response) => response.result);

module.exports = {
  getCurrentNode,
};
