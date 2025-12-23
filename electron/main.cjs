const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // DEV
  mainWindow.loadURL("http://localhost:5173");

  // PROD (quando buildar)
  // mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.whenReady().then(createWindow);

/**
 * Função genérica para executar PowerShell
 */
function runPowerShell(scriptPath, args, onLog) {
  return new Promise((resolve, reject) => {
    const ps = spawn("powershell.exe", [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      scriptPath,
      ...args,
    ]);

    ps.stdout.on("data", (data) => {
      onLog(data.toString());
    });

    ps.stderr.on("data", (data) => {
      onLog(`ERRO: ${data.toString()}`);
    });

    ps.on("close", (code) => {
      code === 0 ? resolve() : reject(code);
    });
  });
}

/**
 * IPC PRINCIPAL
 */
ipcMain.handle("start-config", async (event, payload) => {
  const configJson = JSON.stringify(payload.config);
  const win = BrowserWindow.getFocusedWindow();

  const sendProgress = (etapa, log) => {
    win.webContents.send("progress", { etapa, log });
  };

  try {
    sendProgress("prepare", "Preparando ambiente...");

    sendProgress("apps", "Instalando aplicativos...");
    await runPowerShell(
      path.join(__dirname, "scripts/install-apps.ps1"),
      [configJson],
      (log) => sendProgress("apps", log)
    );

    sendProgress("system", "Aplicando configurações do sistema...");
    await runPowerShell(
      path.join(__dirname, "scripts/system-config.ps1"),
      [configJson],
      (log) => sendProgress("system", log)
    );

    sendProgress("finish", "Finalizando...");
    await runPowerShell(
      path.join(__dirname, "scripts/finalize.ps1"),
      [],
      (log) => sendProgress("finish", log)
    );

    sendProgress("finish", "Configuração concluída com sucesso ✅");
    return { success: true };
  } catch (err) {
    sendProgress("finish", `Erro crítico: ${err}`);
    return { success: false };
  }
});
