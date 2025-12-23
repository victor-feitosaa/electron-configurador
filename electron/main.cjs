const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs")
    }
  });

  win.loadURL("http://localhost:5173");
}

ipcMain.on("start-config", (event, payload) => {
  console.log("Configuração recebida:", payload);

  event.sender.send("log", "Iniciando configuração...");
  event.sender.send("progress", 10);

  setTimeout(() => {
    event.sender.send("log", "Instalando aplicativos...");
    event.sender.send("progress", 60);
  }, 1500);

  setTimeout(() => {
    event.sender.send("log", "Configuração finalizada!");
    event.sender.send("progress", 100);
  }, 3000);
});

app.whenReady().then(createWindow);
