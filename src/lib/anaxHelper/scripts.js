/* eslint-disable no-unused-vars */
const Promise = require('bluebird');
const childProcess = require('child_process');

const logger = require('@bananabread/sumologic-winston-logger');
const { getRichError } = require('@bananabread/response-helper');

const {
  hzn: {
    exchangeUrl,
    cssUrl,
    exchangeUserAuth,
    orgId,
    defaultNodeToken,
  },
} = require('../../configuration/config');
const {
  scriptFileValues,
  scriptCommandValues,
} = require('./util');

const timeoutBWAnaxInitializationAndRegisteration = 10000; // 10 seconds in milliseconds
const deployAndRegisterAnaxRequests = {};

const runScriptFile = (scriptFileName, args = '', env = {}, correlationId) => {
  let scriptEnvs = '';
  Object.keys(env).forEach((envName) => {
    scriptEnvs += `export ${envName}=${env[envName]} && `;
  });

  const terminalStatement = `${scriptEnvs} sh src/scripts/${scriptFileName} ${args}`;
  logger.debug(`Running script file: ${scriptFileName}`, {
    scriptFileName, args, env, terminalStatement, correlationId,
  });

  return new Promise((resolve, reject) => {
    try {
      let output = '';
      const outputAggregator = (data) => {
        output = data;
      };

      const execInstance = childProcess.exec(terminalStatement, (error, stdOut) => {
        outputAggregator(stdOut);
        logger.debug(`stdOut received from script file: ${scriptFileName}`, {
          stdOut, terminalStatement, correlationId,
        });
      });

      execInstance.on('exit', () => {
        logger.debug(`Ended running script file: ${scriptFileName}`, {
          output, terminalStatement, correlationId,
        });
        resolve(output);
      });
    }
    catch (error) {
      reject(error);
    }
  });
};

const runScriptCommand = (command, env = {}, correlationId) => {
  let scriptEnvs = '';
  Object.keys(env).forEach((envName) => {
    scriptEnvs += `export ${envName}=${env[envName]} && `;
  });

  const terminalStatement = `${scriptEnvs} ${command}`;
  logger.debug(`Running script command: '${command}'`, {
    command, env, terminalStatement, correlationId,
  });

  return new Promise((resolve, reject) => {
    try {
      let output = '';
      const outputAggregator = (data) => {
        output = data;
      };

      const execInstance = childProcess.exec(terminalStatement, (error, stdOut) => {
        outputAggregator(stdOut);
        logger.debug(`stdOut received from script command: '${command}'`, {
          stdOut, terminalStatement, correlationId,
        });
      });

      execInstance.on('exit', () => {
        logger.debug(`Ended running script command: '${command}'`, {
          output, terminalStatement, correlationId,
        });
        resolve(output);
      });
    }
    catch (error) {
      reject(error);
    }
  });
};

const deployAndRegisterAnaxNode = (nodeId, nodePort, correlationId) => {
  const successStatement = 'Horizon agent started successfully';

  if (deployAndRegisterAnaxRequests[nodeId]) {
    logger.debug('Deploying and registering Anax Node request already in process, duplicate new request not processed', {
      nodeId, nodePort, correlationId,
    });
    return Promise.resolve();
  }

  deployAndRegisterAnaxRequests[nodeId] = nodePort;
  logger.debug('Deploying and registering Anax Node', {
    nodeId, nodePort, correlationId,
  });

  const startArgs = [
    scriptFileValues.ANAX_DEPLOYMENT_SCRIPT,
    `start ${nodeId} ${nodePort}`,
    {
      HZN_EXCHANGE_URL: exchangeUrl,
      HZN_FSS_CSSURL: cssUrl,
    },
    correlationId,
  ];

  const stopArgs = [...startArgs];
  stopArgs[1] = `stop ${nodeId} ${nodePort}`;

  return runScriptFile(...stopArgs)
    .catch(() => { })
    .then(() => runScriptFile(...startArgs))
    .catch((error) => {
      throw getRichError('System', 'Cannot run gateway anax deployment script', { error }, null, 'error');
    })
    // eslint-disable-next-line arrow-body-style
    .then((output) => {
      return new Promise((resolve, reject) => {
        logger.debug('Waiting timeout before registering node...', {
          nodeId, nodePort, correlationId, timeout: timeoutBWAnaxInitializationAndRegisteration,
        });
        setTimeout(() => {
          // TODO Shouldnt always resolve
          resolve(runScriptCommand(
            scriptCommandValues.REGISTER_ANAX,
            {
              HORIZON_URL: `http://localhost:${nodePort}`,
              HZN_EXCHANGE_URL: exchangeUrl,
              HZN_EXCHANGE_USER_AUTH: exchangeUserAuth,
              HZN_ORG_ID: orgId,
              HZN_EXCHANGE_NODE_AUTH: `${nodeId}:${defaultNodeToken}`,
            },
            correlationId,
          ));
        }, timeoutBWAnaxInitializationAndRegisteration);
      });
      // console.log('===> output 2', output);
      // if (output.indexOf(successStatement) > -1) return;
      // throw getRichError('System', 'Error received from gateway anax deployment script, success statement not found', { output }, null, 'error');
    })
    .then(() => {
      logger.debug('Deployed and registered Anax Node', {
        nodeId, nodePort, correlationId,
      });
    })
    .finally(() => {
      delete deployAndRegisterAnaxRequests[nodeId];
    });
};

const purgeDocker = () => runScriptCommand(scriptCommandValues.NUKE_DOCKER);

module.exports = {
  purgeDocker,
  deployAndRegisterAnaxNode,
};
