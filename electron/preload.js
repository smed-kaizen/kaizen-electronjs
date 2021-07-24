const { contextBridge, ipcRenderer } = require("electron");


// setting up the server and the db
const server = require('../server/app')
server.setup()

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, ...args) => {
      // whitelist channels
      let validChannels = Object.keys(server.services)
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
    }
  }
);
