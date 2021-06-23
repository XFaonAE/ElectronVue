const { CliSpinner } = require("@axerillc/clispinner");
const ChildProcess = require("child_process");
const Chalk = require("chalk");
const FileSystem = require("fs");
const Path = require("path");
const TypeScript = require("typescript");

class Dev {
    public args: string[] | undefined;

    public cwd: string | undefined;

    constructor() {
        CliSpinner.write("Preparing to start development server...");
        this.args = process.env.COMMAND_ARGS?.split(",");
        this.cwd = process.env.RUN_DIRECTORY;
        this.start();
    }

    public start() {
        if (this.hasInit()) {
            CliSpinner.stop(Chalk.hex("#50ffab")("✓"));
            CliSpinner.write("Starting development script...");
            if (this.args !== undefined && this.args[1]) {
                this.runDev(this.args[1]);
            } else {
                this.runDev("./");
            }
        }
    }

    public runDev(directory: string) {
        const electronVuePath = Path.join(this.cwd, directory, ".electron-vue");
        FileSystem.readFile(Path.join(electronVuePath, "./Dev.ts"), "utf8", (error, data) => {
            CliSpinner.stop(Chalk.hex("#50ffab")("✓"));
            eval(TypeScript.transpileModule(data, { }).outputText);
        });
    }

    public hasInit() {
        return true;
    }
}

const dev = new Dev();