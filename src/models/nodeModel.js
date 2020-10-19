const Promise = require('bluebird');
const { getRichError } = require('@bananabread/response-helper');

const nodes = {};

const checkIfValidNode = (node, correlationId) => Promise.resolve()
  .then(() => {
    if (!node || !node.id) {
      throw getRichError('System', 'Invalid node', { node }, null, 'error', correlationId);
    }
  });

const saveNode = (node, correlationId) => checkIfValidNode(node, correlationId)
  .catch((err) => {
    throw getRichError('System', 'Could not save node, invalid format', { node }, err, 'error', correlationId);
  })
  .then(() => {
    if (nodes[node.id]) {
      throw getRichError('System', 'Could not save node, node already exists', { node }, null, 'error', correlationId);
    }
    nodes[node.id] = node;
    return node;
  });

const getAllNodes = () => Promise.resolve(Object.values(nodes));

const findNodeById = (id) => Promise.resolve(nodes[id]);

const getNodeById = (id, correlationId) => findNodeById(id)
  .then((node) => {
    if (node) return node;
    throw getRichError('System', 'Could not get node', { id }, null, 'error', correlationId);
  });

const deleteNodeById = (id) => Promise.resolve()
  .then(() => {
    delete nodes[id];
  });

const saveAndReplaceNode = (node, correlationId) => checkIfValidNode(node, correlationId)
  .catch((err) => {
    throw getRichError('System', 'Could not saveAndReplace node, invalid format', { node }, err, 'error', correlationId);
  })
  .then(() => deleteNodeById(node.id))
  .then(() => {
    nodes[node.id] = node;
    return node;
  });

module.exports = {
  saveNode,
  getAllNodes,
  getNodeById,
  findNodeById,
  deleteNodeById,
  saveAndReplaceNode,
};
