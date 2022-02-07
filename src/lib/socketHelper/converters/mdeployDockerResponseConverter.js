const { containerLabelPrefix } = require('../../../configuration/config');

const {
  LOG_TYPE,
  SERVER_TYPE,
  saveLog,
} = require('../../../models/nodeDetailsModel');

const {
  dockerFetchOneContainerSample,
  dockerFetchAllContainerSample,
} = require('./samples');

const SERVICE_NAME_LABEL = '.service_name';
const AGREEMENT_ID_LABEL = '.agreement_id';

// const addLabels = (dockerResponse, mdeployResponse) => {
//   const updatedResponse = { ...dockerResponse };

//   const [agreementId, serviceName] = mdeployResponse.name.split('-');

//   const newLabels = {};
//   newLabels[`${containerLabelPrefix}${SERVICE_NAME_LABEL}`] = serviceName;
//   newLabels[`${containerLabelPrefix}${AGREEMENT_ID_LABEL}`] = agreementId;

//   if (updatedResponse.Config && updatedResponse.Config.Labels) {
//     updatedResponse.Config.Labels = { ...updatedResponse.Config.Labels, ...newLabels };
//   }
//   else {
//     updatedResponse.Labels = { ...updatedResponse.Labels, ...newLabels };
//   }

//   return updatedResponse;
// };

const convertContainerResponse = (sampleResponse, mdeployResponse) => {
  const convertedResponse = { ...sampleResponse };

  const finalEnv = Object.entries(mdeployResponse.env).map(([envKey, envValue]) => `${envKey}=${envValue}`);
  const finalLabels = { ...mdeployResponse.labels };

  convertedResponse.Id = mdeployResponse.id;
  convertedResponse.Config = mdeployResponse.metadata;
  convertedResponse.Env = finalEnv;
  convertedResponse.Config.Env = finalEnv;
  convertedResponse.Config.Labels = finalLabels;
  convertedResponse.Labels = finalLabels;

  // Remove mdeploy properties
  delete convertedResponse.env;
  delete convertedResponse.clientId;
  delete convertedResponse.created;
  delete convertedResponse.id;
  delete convertedResponse.image;
  delete convertedResponse.imageId;
  delete convertedResponse.name;
  delete convertedResponse.state;
  delete convertedResponse.labels;
  delete convertedResponse.metadata;

  return convertedResponse;
};

const convertContainerResponseForFetchOne = (nodeId, mdeployContainerResponse, correlationId) => {
  let convertedResponse = {};
  try {
    convertedResponse = convertContainerResponse(dockerFetchOneContainerSample, mdeployContainerResponse);
    convertedResponse.Created = (new Date(mdeployContainerResponse.created)).toISOString();
  }
  catch (error) {
    saveLog(
      nodeId,
      LOG_TYPE.INFO,
      SERVER_TYPE.EDGEDAEMON_FACING,
      'Error occured while converting mdeploy response to docker fetch one container response',
      { mdeployContainerResponse, convertedResponse, error },
      correlationId,
    );
  }
  return convertedResponse;
};

const convertContainerResponseForFetchAll = (nodeId, mdeployContainerResponse, correlationId) => {
  let convertedResponse = {};
  try {
    convertedResponse = convertContainerResponse(dockerFetchAllContainerSample, mdeployContainerResponse);
    convertedResponse.Created = Math.floor(mdeployContainerResponse.created / 1000);
  }
  catch (error) {
    saveLog(
      nodeId,
      LOG_TYPE.INFO,
      SERVER_TYPE.EDGEDAEMON_FACING,
      'Error occured while converting mdeploy response to docker fetch all containers response',
      { mdeployContainerResponse, convertedResponse, error },
      correlationId,
    );
  }
  return convertedResponse;
};

module.exports = {
  convertContainerResponseForFetchOne,
  convertContainerResponseForFetchAll,
};
