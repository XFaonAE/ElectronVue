import cliSpinner from "@axerillc/cli-spinner";
import path from "path";
import chalk from "chalk";
import { exec, spawn } from "child_process";
import electron from "electron";

export default class DevCli {
    public constructor() {
        console.log(chalk.hex("#aaa")("───"), chalk.hex("#50ffab")("| Electron Vue |"), chalk.hex("#aaa")("────────────────────"));
        cliSpinner.write("Starting VueJS development server...");
        this.startRenderer().then(() => {
            cliSpinner.stop("✓");
            cliSpinner.write("Starting window process...");
            this.startElectron();
        });
    }

    /**
     * Start the renderer process
     * @param { string[] } options All the startup options
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
        });
    }
}