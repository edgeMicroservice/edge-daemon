const init = require('@bananabread/init');
const app = require('connect')();

let config = require('./configuration/config');
const { start } = require('./lib/nodeSyncJob');

init(app, __dirname, config, () => Promise.resolve(), { preOps: [start] }).then((result) => {
  ({ config } = result);
});

module.exports = app;
