const Promise = require('bluebird');
const { getRichError } = require('@bananabread/response-helper');

const daemons = {};
const logLengthLimit = 1000;

const checkIfValidDaemon = (daemon, correlationId) => Promise.resolve()
  .then(() => {
    if (!daemon || !daemon.nodeId) {
      throw getRichError('System', 'Invalid daemon, nodeId not present', { daemon }, null, 'error', correlationId);
    }
    if (!daemon.logs || typeof daemon.logs !== 'string') {
      throw getRichError('System', 'Invalid daemon, logs not present or not string', { daemon }, null, 'error', correlationId);
    }
  });

const saveDaemon = (daemon, correlationId) => checkIfValidDaemon(daemon, correlationId)
  .catch((err) => {
    throw getRichError('System', 'Could not save daemon, invalid format', { daemon }, err, 'error', correlationId);
  })
  .then(() => {
    if (daemons[daemon.nodeId]) {
      throw getRichError('System', 'Could not save daemon, node already exists', { daemon }, null, 'error', correlationId);
    }
    daemons[daemon.nodeId] = daemon;
    return daemon;
  });

const getAllDaemons = () => Promise.resolve(Object.values(daemons));

const findDaemonById = (nodeId) => Promise.resolve(daemons[nodeId]);

const getDaemonById = (nodeId, correlationId) => findDaemonById(nodeId)
  .then((daemon) => {
    if (daemon) return daemon;
    throw getRichError('System', 'Could not get daemon', { nodeId }, null, 'error', correlationId);
  });

const deleteDaemonById = (nodeId) => Promise.resolve()
  .then(() => {
    delete daemons[nodeId];
  });

const addLogsById = (nodeId, text) => getDaemonById(nodeId)
  .then((daemon) => {
    const updatedDaemon = daemon;
    if (daemon.logs.length > logLengthLimit) {
      updatedDaemon.logs = `${daemon.logs.substr(text.length)}\n\n${text}`;
    }
    else {
      updatedDaemon.logs += `\n\n${text}`;
    }
    daemons[nodeId] = updatedDaemon;
  });

module.exports = {
  saveDaemon,
  getAllDaemons,
  findDaemonById,
  getDaemonById,
  deleteDaemonById,
  addLogsById,
};
