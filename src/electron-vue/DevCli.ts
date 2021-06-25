import cliSpinner from "@axerillc/cli-spinner";
import path from "path";
import chalk from "chalk";
import { exec, spawn } from "child_process";
import electron from "electron";
import readLineConstructor from "readline";
import componentUtils from "./ComponentUtils";

export default class DevCli {
    /**
     * Object for reading CLI input
     * @var { any }
     */
    public readLine: any;

    /**
     * ElectronJS process
     * @var { any }
     */
    public electronProcess: any;

    /**
     * VueJS process
     * @var { any }
     */
    public vueProcess: any;

    /**
     * ElectronVue main instance
     * @var { any }
     */
    public electronVue: any;

    /**
     * Current project configuration
     * @var { string[] }
     */
    public projectConfig: string[];

    /**
     * ElectronVue development command script
     * @param { any } electronVue ElectronVue instance
     * @returns { null }
     */
    public constructor(electronVue: any) {
        // Initialize vars
        this.electronVue = electronVue;
        this.electronProcess = null;
        this.vueProcess = "not started";
        this.readLine = readLineConstructor.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.projectConfig = require(path.join(this.electronVue.startedIn, "electron-vue.config.js"));

        // Startup message
        console.log(chalk.hex("#555")("────"), chalk.hex("#fff")("Electron Vue"), chalk.hex("#555")("────────────────────"));

        const runElectronLogic = () => {
            cliSpinner.write("Starting window process...");
            this.startElectron().then((electronProcess: any) => {
                this.electronProcess = electronProcess;
                cliSpinner.stop("✓");
                cliSpinner.fullStop();
                
                // Listen for user commands
                this.listenCommands();
            });
        }

        // Run ElectronJS main if skip renderer is true
        if (this.electronVue.args[1] == "true") {
            runElectronLogic();
            return;
        }

        // Start VueJS renderer then ElectronJS
        cliSpinner.write("Starting VueJS development server...");
        this.startRenderer().then((vueProcess: any) => {
            this.vueProcess = vueProcess;
            cliSpinner.stop("✓");
            runElectronLogic();
        });
    }

    /**
     * Prepare a command to be ready for use
     * @param { string } rawCommand Raw command
     * @return { Promise }
     */
    public prepareCommand(command: string) {
        return new Promise((resolve: any, reject: any) => {
            const commandNew = command.split(" ");
            resolve(commandNew);
        });
    }

    /**
     * Listen to user inputted commands
     * @return { Promise }
     */
    public listenCommands() {
        // Listen to a command
        this.readLine.question("Electron Vue > ", (response: any) => {
            this.prepareCommand(response).then((newCommand: any) => {
                switch (newCommand[0]) {
                    case "restart":
                        cliSpinner.write("Restarting...");
                        this.restartElectron(this.electronProcess).then((newElectronProcess: any) => {
                            this.electronProcess = newElectronProcess;
                            cliSpinner.stop("✓");
                            this.listenCommands();
                        });
                        break;

                    case "get":
                        switch (newCommand[1]) {
                            case "config":
                                console.log(this.projectConfig);
                                this.listenCommands();
                                break;

                            case "components":
                                console.log(componentUtils.getAllComponents(this.projectConfig));
                                this.listenCommands();
                                break;
                        }
                        break;

                    case "start": 
                        switch (newCommand[1]) {
                            case "renderer":
                                if (this.vueProcess != "not started") {
                                    console.log(chalk.hex("#ff7777")("[ Error ]"), "The renderer is already running and cannot be restarted");
                                } else {
                                    this.vueProcess = "starting...";
                                    cliSpinner.write("Starting VueJS development server...");
                                    
                                    this.startRenderer().then((vueProcess: any) => {
                                        this.vueProcess = vueProcess;
                                        cliSpinner.stop("✓");
                                        cliSpinner.write("Restarting ElectronJS...");
                                        this.restartElectron(this.electronProcess).then((newElectronProcess: any) => {
                                            this.electronProcess = newElectronProcess;
                                            cliSpinner.stop("✓");
                                            this.listenCommands();
                                        });
                                    });
                                }
                                break;

                            case "vue-update-assets":
                                componentUtils.loadAllKeys(this.projectConfig);
                                break;
                        }
                        break;
                    
                    case "stop":
                        process.exit(0);
                        break;
                }
                this.listenCommands();
            });
        });
    }

    /**
     * Start the renderer process
     * @param { string[] } options All the startup options
     * @return { Promise }
     */
    public startRenderer(options: string[] = []) {
        return new Promise((resolve: any, reject: any) => {
            // Start the renderer
            componentUtils.loadAllKeys(this.projectConfig).then(() => {
                const rendererProcess = exec("npx webpack serve --mode development --hot", {
                    cwd: path.join(__dirname, "../../")
                });

                // Check if the renderer was successful
                rendererProcess.stdout?.on("data", (data: string) => {
                    if (data == "\x1B[34mi\x1B[39m \x1B[90m｢wdm｣\x1B[39m: Compiled successfully.\n") {
                        resolve(rendererProcess);
                    }
                });
            });
        });
    }

    /**
     * Start ElectronJS
     * @param { string[] } options All startup options
     * @return { Promise }
     */
    public startElectron(options: string[] = []) {
        return new Promise((resolve: any, reject: any) => {
            // Start electron
            const electronProcess = spawn(electron, [ path.join(__dirname, "../electron/ElectronMain.js") ]);
            electronProcess.stdout.on("data", (data: any) => {
                resolve(electronProcess);
            });
        });
    }

    /**
     * Restart ElectronJS process
     * @param { any } electronProcess ElectronJS process
     * @return { Promise }
     */
    public restartElectron(electronProcess: any) {
        return new Promise((resolve: any, reject: any) => {
            electronProcess.kill();
            resolve(this.startElectron().then((electronNewProcess: any) => {
                return electronNewProcess;
            }));
        });
    }
}