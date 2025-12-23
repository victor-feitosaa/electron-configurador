const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  startConfig: (payload) => ipcRenderer.send("start-config", payload),

  onLog: (callback) => {
    ipcRenderer.on("log", (_, message) => callback(message));
  },

  onProgress: (callback) => {
    ipcRenderer.on("progress", (_, value) =""> callback(value));
  }
});
