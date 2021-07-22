const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require("electron-is-dev");
const path = require('path')
const server = require('../server/app')

for(const service in server.services) {
  ipcMain.handle(service, ((event, METHOD, id, data, params) => {
    console.debug('handling ...', METHOD, id, data, params)

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

function createWindow () {
  // Create the browser window.
  console.log('PReload', __dirname + '/preload.js')
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../src/images/logo.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: __dirname + '/preload.js'
    }
  })

  //load the index.html from a url
  win.loadURL(isDev? 'http://localhost:3000' : `file://${path.join(__dirname, "../ui/build/index.html")}` );

  // Open the DevTools.
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


