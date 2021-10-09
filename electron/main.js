const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');
const path = require('path')
const setupFeathersServices = require('./setup-feathers-services')
const server = require('../server/app')
// Setting up the services in the IPCMain.
setupFeathersServices(server)

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 500,
    minWidth: 450,
    maxWidth: 600,
    minHeight: 600,
    height: 600,
    icon: path.join(__dirname, '../assets/logo.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: __dirname + '/preload.js'
    }
  })

  //load the index.html from a url
  win.loadURL(isDev? 'http://localhost:3000' : `file://${path.join(__dirname, '../ui/build/index.html')}` );
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


