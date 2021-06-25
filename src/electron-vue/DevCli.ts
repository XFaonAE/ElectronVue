import cliSpinner from "@axerillc/cli-spinner";
import path from "path";
import chalk from "chalk";
import { exec, spawn } from "child_process";
import electron from "electron";
import readLineConstructor from "readline";

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

    public constructor() {
        // Initialize vars
        this.electronProcess = null;
        this.readLine = readLineConstructor.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Startup message
        console.log(chalk.hex("#fff")("───"), chalk.hex("#50ffab")("Electron Vue"), chalk.hex("#fff")("────────────────────"));
        cliSpinner.write("Starting VueJS development server...");
        // this.startRenderer().then(() => {
            cliSpinner.stop("✓");
            cliSpinner.write("Starting window process...");
            this.startElectron().then((electronProcess: any) => {
                this.electronProcess = electronProcess;
                cliSpinner.stop("✓");
                cliSpinner.fullStop();
                
                // Listen for user commands
                this.listenCommands();
            });
        // });
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
        this.readLine.question("Electron Vue > ", (response: any) => {
            this.prepareCommand(response).then((newCommand: any) => {
                switch (newCommand[0]) {
                    case "restart":
                        cliSpinner.write("Restarting...");
                        this.restartElectron(this.electronProcess).then((newElectronProcess: any) => {
                            this.electronProcess = newElectronProcess;
                            cliSpinner.stop("✓");
                        });
                        break;
                    
                    case "stop":
                        process.exit(0);
                        break;
                }
                cliSpinner.fullStop();
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
            const rendererProcess = exec("npx webpack serve --mode development --hot", {
                cwd: path.join(__dirname, "../../")
            });

            // Check if the renderer was successful
            if (rendererProcess !== null || rendererProcess !== undefined) {
                rendererProcess.stdout.on("data", (data: string) => {
                    if (data == "\x1B[34mi\x1B[39m \x1B[90m｢wdm｣\x1B[39m: Compiled successfully.\n") {
                        resolve();
                    }
                });
            }
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