/* eslint-disable no-unused-vars */
const http = require('http');
const Promise = require('bluebird');
const { response } = require('express');

const makeSockerRequester = (nodeId) => {
  const DOCKER_SOCKET_FILE = '/var/run/docker.sock';

  const request = () => new Promise((resolve, reject) => {
    // resolve();
    // return;
    const options = {
      socketPath: DOCKER_SOCKET_FILE,
      path: '/containers/create?name=9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1-mreport',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const responses = [];
    try {
      const callback = (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          responses.push({
            headers: res.headers,
            body: data,
            status: {
              code: res.statusCode,
              message: res.statusMessage,
            },
          });
        });
        res.on('error', (data) => {
          reject(data);
        });
        res.on('close', (data) => {
          resolve(responses);
        });
      };

      // log('===> docker request data: ', options);
      const clientRequest = http.request(options, callback);
      clientRequest.write('{"ExposedPorts":{"80/tcp":{}},"Env":["HZN_EXCHANGE_URL=http://192.168.1.89:3090/v1/","HZN_CPUS=4","HZN_RAM=3781","HZN_DEPLOYMENT_LOCATION=edge","HZN_DEVICE_ID=018227a7036a490e","HZN_ESS_CERT=/ess-cert/cert.pem","HZN_PRIVILEGED=false","HZN_HOST_IPS=127.0.0.1,172.17.0.3","HZN_ORGANIZATION=myorg","HZN_ESS_AUTH=/ess-auth/auth.json","HZN_ESS_API_PROTOCOL=secure-unix","HZN_ESS_API_ADDRESS=/var/tmp/horizon/anax_018227a7036a490e/fss-domain-socket/essapi.sock","HZN_ESS_API_PORT=0","HZN_ARCH=amd64","HZN_HARDWAREID=00ec2568daa80cd925a81c119cdf713b1fb7566d","HZN_AGREEMENTID=9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1","HZN_PATTERN="],"Cmd":null,"Image":"kevintoor/mreport@sha256:1546c0c44601b13ec26f9891f0fd2f100c71b93dd3760889d16a4a3dcc49093f","Volumes":{"/ess-auth":{},"/ess-cert":{},"/service_config":{},"/var/tmp/horizon/anax_018227a7036a490e/fss-domain-socket":{}},"Entrypoint":null,"Labels":{"openhorizon.anax.agreement_id":"9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1","openhorizon.anax.deployment_description_hash":"5t4CX22E4l-JLgBgc1Hjt6O27sg=","openhorizon.anax.service_name":"mreport","openhorizon.anax.variation":""},"HostConfig":{"Binds":["9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1:/service_config:rw","/var/tmp/horizon/anax_018227a7036a490e/fss-domain-socket:/var/tmp/horizon/anax_018227a7036a490e/fss-domain-socket","/var/tmp/horizon/anax_018227a7036a490e/ess-auth/9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1:/ess-auth:ro","/var/tmp/horizon/anax_018227a7036a490e/ess-auth/SSL/cert:/ess-cert:ro"],"PortBindings":{"80/tcp":[{"HostIp":"0.0.0.0","HostPort":"9080/tcp"}]},"NetworkMode":"9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1","ConsoleSize":[0,0],"RestartPolicy":{"Name":"always"},"LogConfig":{"Type":"syslog","Config":{"tag":"workload-9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1_mreport"}},"Memory":3964665856},"NetworkingConfig":{"EndpointsConfig":{"9009ae70c0e60bcea5638f1125eccf8a29c0ab067dd62f618738bb6d9cc700d1":{"Aliases":["mreport"]}}}}');
      clientRequest.end();
    }
    catch (e) {
      console.log('===> MAJOR ERROR ALERT', e);
      reject();
    }
  });

  return {
    request,
  };
};

makeSockerRequester().request()
  .then((data) => {
    console.log('===> data', data);
  })
  .catch((error) => {
    console.log('===> error', error);
  });
