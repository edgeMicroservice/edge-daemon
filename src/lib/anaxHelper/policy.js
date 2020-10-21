const fs = require('fs-extra');

const { getRichError } = require('@bananabread/response-helper');

const {
  hzn: {
    nodePoliciesDir,
  },
} = require('../../configuration/config');

const createPolicyFile = (nodeId, properties = {}, constraints = [], correlationId) => {
  console.log('===> nodePoliciesDir', nodePoliciesDir);
  const file = `${nodePoliciesDir}/policy_${nodeId}.json`;
  return fs.writeJSON(file, { properties, constraints })
    .then((savedFile) => {
      console.log('===> savedFile', savedFile);
      return file;
    })
    .catch((error) => {
      console.log('===> Error occured while writing policy file', error);
      throw getRichError(
        'System', 'Error occured while writing policy file',
        {
          nodeId,
          properties,
          constraints,
          error,
        },
        null, 'error', correlationId,
      );
    });
};

module.exports = {
  createPolicyFile,
};
