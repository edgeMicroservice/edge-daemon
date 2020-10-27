const { sendResult, sendError } = require('@bananabread/response-helper');
const { convertParams } = require('@bananabread/swagger-helper');

const nodeProcessor = require('../processors/nodeProcessor');

const getNodes = (req, res) => {
  const options = convertParams(req);
  console.log('===> options', options);

  nodeProcessor.getNodes(options.mdeployStatus, options.correlationId)
    .then((results) => sendResult(results, 201, res, options))
    .catch((err) => sendError(err, res, null, options));
};

const getDaemon = (req, res) => {
  const options = convertParams(req);

  nodeProcessor.getDaemon(options.id, options.correlationId)
    .then((results) => sendResult(results, 201, res, options))
    .catch((err) => sendError(err, res, null, options));
};

module.exports = {
  getNodes,
  getDaemon,
};
