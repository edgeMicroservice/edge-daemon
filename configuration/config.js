const config = {
  gatewayNodeId: process.env.GATEWAY_NODE_ID,
  targetIPAddress: process.env.TARGET_IP_ADDRESS,
  targetEdgeAccessToken: process.env.TARGET_EDGE_ACCESS_TOKEN,
  projectId: process.env.PROJECT_ID,
}

const validator = () => {
  Object.values(config).forEach(((val) => {
    if (!val) {
      console.log('Config values not configured properly:', config)
      process.exit(1)
    }
  })); 
}

const getConfig = () => {
  validator();
  return config;
}

module.exports = {
  getConfig,
};
