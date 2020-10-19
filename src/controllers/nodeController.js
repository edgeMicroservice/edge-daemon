const { sendResult, sendError } = require('@bananabread/response-helper');
const { convertParams } = require('@bananabread/swagger-helper');

const nodeProcessor = require('../processors/nodeProcessor');

const getNodes = (req, res) => {
  const options = convertParams(req);

  nodeProcessor.getNodes(options.correlationId)
    .then((results) => sendResult(results, 201, res, options))
    .catch((err) => sendError(err, res, null, options));
};

module.exports = {
  getNodes,
};
