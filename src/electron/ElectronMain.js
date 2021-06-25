"use strict";
var _a = require("electron"), BrowserWindow = _a.BrowserWindow, app = _a.app;
var ElectronMain = /** @class */ (function () {
    /**
     * ElectronJS main process
     */
    function ElectronMain() {
        var _this = this;
        app.on("ready", function () {
            _this.window = _this.createWindow();
            _this.window.loadURL("http://localhost:8080");
            _this.window.webContents.executeJavaScript("\n                const electron = require(\"electron\");\n            ");
        });
    }
    /**
     * Create a new window object
     * @return { BrowserWindow } Window object
     */
    ElectronMain.prototype.createWindow = function () {
        // Construct the window object
        var window = new BrowserWindow({
            width: 1000,
            height: 600,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true
            }
        });
        return window;
    };
    return ElectronMain;
}());
// Construct ElectronJS
new ElectronMain();
