const rp = require('request-promise')

const config = require('../configuration/config').getConfig();

const edgeAccessToken = `Bearer ${config.targetEdgeAccessToken}`
const request = ({
  method,
  host,
  endpoint,
  headers,
  body
}) => {
  if (method === 'POST') {
    console.log('===> sending mdeploy post request')
    rp({
      uri: `http://${config.targetIPAddress}:8083/${config.projectId}/mdeploy/v1/images`,
      method: 'POST',
      headers: {
        'Authorization': edgeAccessToken
      },
      body: {
        "nodeId": config.gatewayNodeId,
        "imageId": `${config.projectId}-mreport-v1`
      },
      json: true
    })
      .then((data) => {
        console.log('===> success response from mdeploy', data);
      })
      .catch((error) => {
        console.log('===> failure response from mdeploy', error);
      })
      
  }


  if (endpoint.includes('ubuntu')) {
    console.log('===> endpoint: ', endpoint)
    console.log('===> sending mdeploy post request')
    rp({
      uri: `http://${config.targetIPAddress}:8083/${config.projectId}/mdeploy/v1/images`,
      method: 'POST',
      headers: {
        'Authorization': edgeAccessToken
      },
      body: {
        "nodeId": config.gatewayNodeId,
        "imageId": `${config.projectId}-microservice-v1`
      },
      json: true
    })
      .then((data) => {
        console.log('===> success response from mdeploy', data);
      })
      .catch((error) => {
        console.log('===> failure response from mdeploy', error);
      })
      
  }
}; 

module.exports = {
  request,
};
