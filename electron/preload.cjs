const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  startConfig: (payload) => ipcRenderer.invoke("start-config", payload),

  onProgress: (callback) => {
    ipcRenderer.on("progress", (_, data) => {
      callback(data);
    });
  },
});
