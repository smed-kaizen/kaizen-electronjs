const assert = require('assert');
const app = require('../../server/app');

describe('\'tasks\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasks');

    assert.ok(service, 'Registered the service');
  });

  describe('Basic CRUD of the Tasks', () => {
    let task
    const taskData = Object.freeze({
      title: 'title'
    })

    it('Fails when the tile of the task is not given', async () => {
      await assert.rejects(app.service('tasks').create({
        title: undefined
      }), /tasks\.title cannot be null/)
    })

    it('Fails when the title is just white spaces', async () => {
      await assert.rejects(app.service('tasks').create({
        title: '       '
      }), /Title should not be empty/)
    })

    it('Fails when the difficulty given is not allowed', async () => {
      await assert.rejects(app.service('tasks').create({
        title: 'title',
        difficulty: 'final boss'
      }), /The difficulty should be either +./)
    })

    it('Creates a task', async () => {
      task = await app.service('tasks').create(taskData)
      assert(task)
      assert.strictEqual(task.difficulty, 'easy', 'Defaults to easy')
      assert.ok(task.createdAt)
      assert.ok(!task.doneAt, 'Should not be done')
    })

  })
});
