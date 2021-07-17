const assert = require('assert');
const app = require('../../server/app');

describe('\'tasks\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasks');

    assert.ok(service, 'Registered the service');
  });
});
