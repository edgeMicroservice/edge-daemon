// const { getRichError } = require('@bananabread/response-helper');

const nodeModel = require('../models/nodeModel');

const getNodes = (correlationId) => nodeModel.getAllNodes(correlationId);

module.exports = {
  getNodes,
};
