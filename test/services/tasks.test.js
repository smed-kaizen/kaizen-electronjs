const assert = require('assert');
const app = require('../../server/app');

describe('\'tasks\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasks');

    assert.ok(service, 'Registered the service');
  });

  describe('Basic CRUD of the Tasks', () => {
    let task, anotherTask, futureTask
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
      assert(task.id)
      assert.strictEqual(task.title, taskData.title)
      assert.strictEqual(task.difficulty, 'easy', 'Defaults to easy')
      assert.ok(task.createdAt)
      assert.ok(!task.doneAt, 'Should not be done')
    })

    it('Fails to create a task with the same title in the same day, It is case insensitive', async () => {
      await assert.rejects(app.service('tasks').create(taskData),
        /You already have a task with this name for today/)
      await assert.rejects(app.service('tasks').create({title: taskData.title.toUpperCase()},
        /You already have a task with this name for today/))
    })

    it('can create a task with the same title for a different day', async () => {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      futureTask = await app.service('tasks').create({
        ...taskData,
        createdAt: tomorrow.toISOString()
      })

      assert.ok(futureTask.id)
      assert.strictEqual(futureTask.title, taskData.title)
    })

    it('Can patch the task', async () => {
      const anotherTaskTitle = `${taskData.title}-another`
      anotherTask = await app.service('tasks').create({ title: anotherTaskTitle })
      assert.ok(anotherTask.id)
      assert.strictEqual(anotherTask.title, anotherTaskTitle)

      const updatedTitle = `${anotherTaskTitle}-updated`
      await app.service('tasks').patch(anotherTask.id, { title: updatedTitle })

      // getting the latest update
      anotherTask = await app.service('tasks').get(anotherTask.id)
      assert.strictEqual(anotherTask.title, updatedTitle)
    })

    it('Can\'t update the title to an existing one in the same day', async () => {
      assert(anotherTask.id)
      await assert.rejects(app.service('tasks').patch(anotherTask.id, taskData),
        /You already have a task with this name for today/)
    })

    it('Can\'t update the title to an empty one', async () => {
      await assert.rejects(app.service('tasks').patch(anotherTask.id, { title: null }),
        /tasks\.title cannot be null/)
      await assert.rejects(app.service('tasks').patch(anotherTask.id, { title: '   ' }),
      /Title should not be empty/)
    })

    it('Can search for tasks', async () => {
      const allTasks = await app.service('tasks').find()
      assert.ok(allTasks.data.length > 0)
      assert.ok(allTasks.total)
    })

    it('Can search for Title', async () => {
      const searchedTasks = await app.service('tasks').find({
        query: {
          title: taskData.title
        }
      })

      // in the previous tasks, there were two tasks created with the same title but each one in different days
      assert.strictEqual(searchedTasks.total, 2)
      assert.strictEqual(searchedTasks.data.length, 2)
      assert.ok(searchedTasks.data.some(t => t.id === task.id))
      assert.ok(searchedTasks.data.some(t => t.id === futureTask.id))
    })

    it('Can search for tasks that are similar to the given query', async () => {
      // This feature can be used for autocomplete
      const alikeTasks = await app.service('tasks').find({
        query: {
          title: {$like: `%${taskData.title}%`}
        }
      })

      // should include task, anotherTask and future task because they all have 'title' in their title
      assert.strictEqual(alikeTasks.total, 3)
      assert.ok(alikeTasks.data.some(t => t.id === task.id))
      assert.ok(alikeTasks.data.some(t => t.id === anotherTask.id))
      assert.ok(alikeTasks.data.some(t => t.id === futureTask.id))
    })

    it('Can get the tasks of today', async () => {
      const tasksOfToday = await app.service('tasks').find({
        query: {
          createdAt: {
            $gte: new Date().setHours(0,0,0,0),
            $lte: new Date().setHours(23, 59, 59, 999)
          }
        }
      })

      // only two tasks for today: task and anotherTask
      assert.strictEqual(tasksOfToday.total, 2)
      assert.ok(tasksOfToday.data.some(t => t.id === task.id))
      assert.ok(tasksOfToday.data.some(t => t.id === anotherTask.id))
    })
  })
});
