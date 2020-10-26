// const { addLogsById } = require('../../models/daemonModel');

const makeLogger = (nodeId) => {
  const log = (text, data) => {
    console.log('===> edge socket logger', { nodeId, text, data });
    // addLogsById(nodeId, `${text}: ${data}`);
  };

  return {
    log,
  };
};

module.exports = makeLogger;
