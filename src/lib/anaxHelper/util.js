const scriptFileValues = {
  ANAX_DEPLOYMENT_SCRIPT: 'deploy_anax.sh',
};

const scriptCommandValues = {
  REGISTER_ANAX: 'hzn register',
  NUKE_DOCKER: 'docker rm -f $(docker ps -a -q)',
};

module.exports = {
  scriptFileValues,
  scriptCommandValues,
};
