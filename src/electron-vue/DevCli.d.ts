export default class DevCli {
    constructor();
    /**
     * Start the renderer process
     * @param { string[] } options All the startup options
     */
    startRenderer(options?: string[]): Promise<unknown>;
    /**
     * Start ElectronJS
     * @param { string[] } options All startup options
     * @return { Promise }
     */
    startElectron(options?: string[]): Promise<unknown>;
}
