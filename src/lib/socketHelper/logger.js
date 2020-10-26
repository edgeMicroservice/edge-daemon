const { addLogsById } = require('../../models/daemonModel');

const makeLogger = (nodeId) => {
  const log = (text) => {
    console.log('===> edge socket logger', { nodeId, text });
    addLogsById(nodeId, text);
  };

  return {
    log,
  };
};

module.exports = makeLogger;
