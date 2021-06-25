export default class DevCli {
    /**
     * Object for reading CLI input
     * @var { any }
     */
    readLine: any;
    /**
     * ElectronJS process
     * @var { any }
     */
    electronProcess: any;
    /**
     * VueJS process
     * @var { any }
     */
    vueProcess: any;
    /**
     * ElectronVue main instance
     * @var { any }
     */
    electronVue: any;
    /**
     * Current project configuration
     * @var { string[] }
     */
    projectConfig: string[];
    /**
     * ElectronVue development command script
     * @param { any } electronVue ElectronVue instance
     * @returns { null }
     */
    constructor(electronVue: any);
    /**
     * Prepare a command to be ready for use
     * @param { string } rawCommand Raw command
     * @return { Promise }
     */
    prepareCommand(command: string): Promise<unknown>;
    /**
     * Listen to user inputted commands
     * @return { Promise }
     */
    listenCommands(): void;
    /**
     * Start the renderer process
     * @param { string[] } options All the startup options
     * @return { Promise }
     */
    startRenderer(options?: string[]): Promise<unknown>;
    /**
     * Start ElectronJS
     * @param { string[] } options All startup options
     * @return { Promise }
     */
    startElectron(options?: string[]): Promise<unknown>;
    /**
     * Restart ElectronJS process
     * @param { any } electronProcess ElectronJS process
     * @return { Promise }
     */
    restartElectron(electronProcess: any): Promise<unknown>;
}
