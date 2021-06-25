const { BrowserWindow, app } = require("electron");

class ElectronMain {
    /**
     * ElectronJS window object
     * @var { BrowserWindow }
     */
    public window: typeof BrowserWindow;

    /**
     * ElectronJS main process
     */
    public constructor() {
        app.on("ready", () => {
            this.window = this.createWindow();
            this.window.loadURL("http://localhost:8080");
            this.window.webContents.executeJavaScript(`
                const electron = require("electron");
            `);
        });
    }

    /**
     * Create a new window object
     * @return { BrowserWindow } Window object
     */
    public createWindow(): typeof BrowserWindow {
        // Construct the window object
        const window = new BrowserWindow({
            width: 1000,
            height: 600,
            frame: false,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                webviewTag: true
            }
        });
        return window;
    }
}

// Construct ElectronJS
new ElectronMain();
