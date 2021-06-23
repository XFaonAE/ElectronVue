const Electron = require("electron");

Electron.app.on("ready", () => {
    const window = new Electron.BrowserWindow({
        width: 1500,
        height: 800
    });
    window.loadURL("http://localhost:8080");
});