const { ipcMain } = require('electron')

/**
 * Setup the services of feathers and make them available for the ipc communication in electron.
 * @param server - Feathers app
 */
module.exports = (server) => {
  for(const service in server.services) {
    ipcMain.handle(service, ((event, METHOD, id, data, params) => {
      const calledService = server.services[service]
      switch(METHOD){
        case "get":
          return errorProneCall(calledService.get(id, params))
        case "find":
          return errorProneCall(calledService.find(params))
        case "create":
          return errorProneCall(calledService.create(data, params))
        case "update":
          return errorProneCall(calledService.update(id, data, params))
        case "patch":
          return errorProneCall(calledService.patch(id, data, params))
        case "remove":
          return errorProneCall(calledService.remove(id, params))
        default:
          throw new Error('Method should be either get, find, create, update, patch, remove')
      }

    }))
  }

  const errorProneCall = async promise => {
    const response = {
      data: null,
      error: true
    }

    try {
      response.data = await promise
      response.error = false
    } catch (err) {
      response.message = err.message
    }

    return response
  }
}
