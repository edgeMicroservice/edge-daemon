const { SERVER_TYPE, LOG_TYPE, saveLog } = require('../../../models/anaxSocketModel');

const converContainerResponse = (nodeId, containerResponse, correlationId) => {
  const convertedResponse = {};
  try {
    convertedResponse.Id = containerResponse.id;
    convertedResponse.Created = (new Date(containerResponse.created)).toISOString();
    convertedResponse.State = {
      Status: 'running',
      Running: true,
      Paused: false,
      Restarting: false,
      OOMKilled: false,
      Dead: false,
      // Pid: 282748, // Might need to add back
      ExitCode: 0,
      Error: '',
      StartedAt: (new Date(containerResponse.created)).toISOString(),
      // FinishedAt: '0001-01-01T00:00:00Z', // Might need to add back
    };

    convertedResponse.Config = {};
    convertedResponse.Config.Env = Object.entries(containerResponse.env).map(([envKey, envValue]) => `${envKey}=${envValue}`);
  }
  catch (error) {
    saveLog(
      nodeId,
      LOG_TYPE.INFO,
      SERVER_TYPE.ANAX_FACING,
      'Error occured while converting mdeploy response to docker response',
      { containerResponse, convertedResponse, error },
      correlationId,
    );
  }
  return convertedResponse;
};

module.exports = {
  converContainerResponse,
};
