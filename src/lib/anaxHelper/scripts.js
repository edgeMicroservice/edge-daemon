/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
const Promise = require('bluebird');
const childProcess = require('child_process');
const fs = require('fs-extra');

const logger = require('@bananabread/sumologic-winston-logger');
const { getRichError } = require('@bananabread/response-helper');

const {
  hzn: {
    exchangeUrl,
    cssUrl,
    cliConfigFile,
    exchangeUserAuth,
    orgId,
    defaultNodeToken,
    anaxStorageBasePath,
  },
} = require('../../configuration/config');
const {
  scriptFileValues,
  scriptCommandValues,
} = require('./util');

const timeoutBWAnaxInitializationAndRegisteration = 5000; // 10 seconds in milliseconds
const deployAndRegisterAnaxRequests = {};

const runScriptFile = (scriptFileName, args = '', env = {}, correlationId) => {
  let scriptEnvs = '';
  Object.keys(env).forEach((envName) => {
    scriptEnvs += `export ${envName}=${env[envName]} && `;
  });

  const terminalStatement = `${scriptEnvs} src/scripts/${scriptFileName} ${args}`;
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

const runScriptCommand = (command, args = '', env = {}, correlationId) => {
  let scriptEnvs = '';
  Object.keys(env).forEach((envName) => {
    scriptEnvs += `export ${envName}=${env[envName]} && `;
  });

  const terminalStatement = `${scriptEnvs} ${command} ${args}`;
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

const updateHznCliConfig = (nodeId) => {
  console.log('===> in updateHznCliConfig');
  const configFileData = `HZN_EXCHANGE_URL=${exchangeUrl}\nHZN_FSS_CSSURL=${cssUrl}\nHZN_DEVICE_ID=${nodeId}\n`;
  return fs.ensureFile(cliConfigFile)
    .then(() => {
      console.log('===> here 1');
    })
    .then(() => fs.writeFile(cliConfigFile, configFileData))
    .then((result) => {
      console.log('===> result in updateHznCliConfig', result);
    })
    .catch((error) => {
      console.log('===> error in updateHznCliConfig', error);
    });
};

const deployAndRegisterAnaxNode = (nodeId, nodePort, policyFilePath, dockerSocketFilePath, correlationId) => {
  // eslint-disable-next-line no-unused-vars
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

  const scriptArgs = [
    scriptFileValues.ANAX_DEPLOYMENT_SCRIPT,
    undefined,
    {
      HZN_EXCHANGE_URL: exchangeUrl,
      HZN_FSS_CSSURL: cssUrl,
      ANAX_NODE_ID: nodeId,
      ANAX_NODE_PORT: nodePort,
      ANAX_STORAGE_BASE_PATH: anaxStorageBasePath,
      HORIZON_URL: `http://localhost:${nodePort}`, // test only
    },
    correlationId,
  ];

  if (dockerSocketFilePath) {
    scriptArgs[2].DOCKER_SOCKET = dockerSocketFilePath;
  }

  const startArgs = [...scriptArgs];
  startArgs[1] = 'start';

  const stopArgs = [...scriptArgs];
  stopArgs[1] = 'stop';

  return updateHznCliConfig(nodeId)
    .then(() => runScriptFile(...stopArgs))
    .catch(() => { })
    .then(() => runScriptFile(...startArgs))
    .catch((error) => {
      throw getRichError('System', 'Cannot run gateway anax deployment script', { error }, null, 'error');
    })
    .then((output) => {
      return new Promise((resolve, reject) => {
        logger.debug('Waiting timeout before registering node...', {
          nodeId, nodePort, correlationId, timeout: timeoutBWAnaxInitializationAndRegisteration,
        });
        setTimeout(() => {
          const cmdArgs = policyFilePath ? ` --policy ${policyFilePath}` : undefined;
          runScriptCommand(
            'hzn env',
            undefined,
            {
              HORIZON_URL: `http://localhost:${nodePort}`,
              HZN_EXCHANGE_URL: exchangeUrl,
              HZN_EXCHANGE_USER_AUTH: exchangeUserAuth,
              HZN_ORG_ID: orgId,
              HZN_EXCHANGE_NODE_AUTH: `${nodeId}:${defaultNodeToken}`,
            },
          )
            .then(() => runScriptCommand(
              scriptCommandValues.REGISTER_ANAX,
              cmdArgs,
              {
                HORIZON_URL: `http://localhost:${nodePort}`,
                HZN_EXCHANGE_URL: exchangeUrl,
                HZN_EXCHANGE_USER_AUTH: exchangeUserAuth,
                HZN_ORG_ID: orgId,
                HZN_EXCHANGE_NODE_AUTH: `${nodeId}:${defaultNodeToken}`,
              },
              correlationId,
            )
              .then((result) => {
                console.log('===> result', result);
                resolve(result);
              })
              .catch((error) => {
                console.log('===> error', error);
                reject(error);
              }));
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
