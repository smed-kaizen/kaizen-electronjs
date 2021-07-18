// This script runs before the tests to make sure everything was setup correctly

const app = require('../../server/app');
const fs = require('fs');
const path = require('path');

exports.mochaHooks = {

  beforeAll: async function() {
    // setting up the db and the services
    app.setup();
  },

  afterAll: async function () {
    const sqliteUrl = app.get('sqlite');
    const [ ,dbPath] = sqliteUrl.match(/sqlite:\/\/(.+)/);
    fs.unlinkSync(path.resolve(dbPath));
  }

};
