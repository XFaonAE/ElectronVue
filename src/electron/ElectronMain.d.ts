declare const BrowserWindow: typeof Electron.BrowserWindow, app: Electron.App;
declare class ElectronMain {
    /**
     * ElectronJS window object
     * @var { BrowserWindow }
     */
    window: typeof BrowserWindow;
    /**
     * ElectronJS main process
     */
    constructor();
    /**
     * Create a new window object
     * @return { BrowserWindow } Window object
     */
    createWindow(): typeof BrowserWindow;
}
