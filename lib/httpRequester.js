const rp = require('request-promise')

const NODE_ID = 'ca4b4d54ca24023f2424d4c5ab1c20dc329450f169565125ee45a475';

const edgeAccessToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNjM4MTkxMTY5NTg1ODU2NTEyIiwianRpIjoiOURSUU43Tn5CVHBQMnhXQ0oyR0YwTX54V3d6dHlycUFKVHNpNzd-dUFGeSIsImNsaWVudF9pZCI6IjA4ZDIxZGQ3LWMzNTItNDcyOS05ZTgwLTM3M2RlODBiZDUzMSIsImF6cCI6IkEyMjkwMzIzOTA5MDYzNzQ0MzczIiwiaXNzIjoiaHR0cHM6Ly9taWQubWltaWszNjAuY29tL21JRC92MS9vYXV0aC90b2tlbiIsIm5vZGVfaWQiOiJiYzhlYmQyYWJmODM5ODMzOGM5ZjhhNjRjYzZmZmIxNDE2NzYwMWE2ODRjOTUzZjNhYWMzOWMxZCIsImF1ZCI6WyJodHRwczovL21pbWlrIiwiaHR0cHM6Ly9tc3QubWltaWszNjAuY29tL21TVC92MS9jbGllbnRzL0dlbmVyaWMtZWRnZSJdLCJzY29wZSI6Im9wZW5pZCBlZGdlOm1jbSBlZGdlOmNsdXN0ZXJzIGVkZ2U6YWNjb3VudDphc3NvY2lhdGUgZWRnZTpyZWFkOmFjY291bnRrZXkiLCJpYXQiOjE1OTgzOTkxODAsImV4cCI6MTYxMzk1MTE4MH0.8FB-zX-cLK-xRdl9ju6MiC2Obynf9p_MhCe7GxIEPB0'
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
      uri: 'http://192.168.1.70:8083/08d21dd7-c352-4729-9e80-373de80bd531/mdeploy/v1/images',
      method: 'POST',
      headers: {
        'Authorization': edgeAccessToken
      },
      body: {
        "nodeId": NODE_ID,
        "imageId": "08d21dd7-c352-4729-9e80-373de80bd531-microservice-v1"
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
      uri: 'http://192.168.1.70:8083/08d21dd7-c352-4729-9e80-373de80bd531/mdeploy/v1/images',
      method: 'POST',
      headers: {
        'Authorization': edgeAccessToken
      },
      body: {
        "nodeId": NODE_ID,
        "imageId": "08d21dd7-c352-4729-9e80-373de80bd531-mdebug-v1"
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


  // if (endpoint === 'DELETE') {
  //   console.log('===> sending mdeploy delete request')
  //   rp({
  //     uri: 'http://192.168.1.70:8083/08d21dd7-c352-4729-9e80-373de80bd531/mdeploy/v1/images/08d21dd7-c352-4729-9e80-373de80bd531-microservice-v1',
  //     method: 'DELETE',
  //     headers: {
  //       'Authorization': edgeAccessToken
  //     },
  //     json: true
  //   })
  //     .then((data) => {
  //       console.log('===> success response from mdeploy', data);
  //     })
  //     .catch((error) => {
  //       console.log('===> failure response from mdeploy', error);
  //     })
  // }
}; 

module.exports = {
  request,
};
