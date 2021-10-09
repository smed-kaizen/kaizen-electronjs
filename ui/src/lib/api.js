/**
 * Create a task
 * @param taskData
 * @param {string} taskData.title - Mandatory title of the task
 * @param {"easy" | "medium" | "hard"} taskData.difficulty - the difficulty of the task. If not given it will default
 * to "easy" but for clarity always provide the difficulty
 * @param {Date} [taskData.createdAt] - optional, When no present, createdAt is equal to today's date. Use this parameter
 * to make tasks for the future dates. Make sure to use ISOString dates. i.e createdAt = new Date().toISOString()
 * @return {Promise<*>}
 */
export function createTask (taskData) {
  return callApi(window.api.send('tasks', { METHOD: 'create', data: taskData }))
}

// { METHOD: 'create', id: , data: , params: }

/**
 *
 * @param taskId
 * @param taskData
 * @return {*}
 */
export function editTask (taskId, taskData) {
  return callApi(window.api.send('tasks', { METHOD: 'patch', id: taskId, data: taskData }))
}

/**
 * Delete a task by id
 * @param taskId
 * @return {*}
 */
export function deleteTask (taskId) {
  return callApi(window.api.send('tasks', { METHOD: 'remove', id: taskId }))
}

/**
 * Get a task by id
 * @param taskId
 * @return {*}
 */
export function getTask (taskId) {
  return callApi(window.api.send('tasks', { METHOD: 'get', id: taskId }))
}

/**
 * Find tasks using a query. To build a query read the documentation here https://docs.feathersjs.com/api/databases/querying.html
 * @param query
 * @return {*}
 */
export function findTasks (query) {
  return callApi(window.api.send('tasks', { METHOD:'find', params: { query } }))
}

/**
 * Find the tasks of a given day from a date
 * @param date - The date of the day to fetch. To fetch current day's tasks: findTasksOfDay(new Date())
 * @return {*}
 */
export function findTasksOfDay (date) {
  const query = {
    createdAt: {
      $gte: new Date(date).setHours(0,0,0,0),
      $lte: new Date(date).setHours(23, 59, 59, 999)
    }
  }

  return findTasks(query)
}

/**
 * When making an api call, all of the errors will be caught and handled by the server itself
 * When an error occur, we get a successful response that includes the property error: true
 * The errors needs to be effectively communicated to the user.
 * @param promise
 */
function callApi (promise) {
  return promise.then(res => {
    if (res.error) {
      throw new Error(res.message)
    }
    return res.data
  })
}
