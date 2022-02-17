const { sendResult, sendError } = require('@mimik/response-helper');
const { convertParams } = require('@mimik/swagger-helper');

const nodeProcessor = require('../processors/nodeProcessor');

const createNode = (req, res) => {
  const options = convertParams(req);

  nodeProcessor.createNode(options.newNode, options.correlationId)
    .then((results) => sendResult(results, 201, res, options))
    .catch((err) => sendError(err, res, null, options));
};

const getNodes = (req, res) => {
  const options = convertParams(req);

  nodeProcessor.getNodes(options.correlationId)
    .then((results) => sendResult(results, 200, res, options))
    .catch((err) => sendError(err, res, null, options));
};

const getNodeDetails = (req, res) => {
  const options = convertParams(req);

  nodeProcessor.getNodeDetails(options.id, options.correlationId)
    .then((result) => sendResult(result, 200, res, options))
    .catch((err) => sendError(err, res, null, options));
};

const deleteNode = (req, res) => {
  const options = convertParams(req);

  nodeProcessor.deleteNode(options.id, options.correlationId)
    .then((result) => sendResult(result, 200, res, options))
    .catch((err) => sendError(err, res, null, options));
};

module.exports = {
  createNode,
  getNodes,
  getNodeDetails,
  deleteNode,
};
