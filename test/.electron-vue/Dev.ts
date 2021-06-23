const { CliSpinner } = require("@axerillc/clispinner");
const ChildProcess = require("child_process");
const Path = require("path");

class Dev {
    public constructor() {
        CliSpinner.write("Starting VueJS server...");
        this.runVueServer(() => {
            CliSpinner.write("Starting ElectronJS...");
            this.runElectron();
        });
    }

    public runElectron() {
        var directory = "./";
        if (process.env.COMMAND_ARGS !== undefined && process.env.COMMAND_ARGS.split(",")[1]) {
            directory = process.env.COMMAND_ARGS.split(",")[1];
        }
        const electronMainPath = Path.join(process.env.RUN_DIRECTORY, directory, "./src/electron/Main.js");
        const projectRoot = Path.join(process.env.RUN_DIRECTORY, directory, "./");
        ChildProcess.exec("cd " + projectRoot + " && electron " + electronMainPath).stdout.on("data", (data) => {
            CliSpinner.stop(Chalk.hex("#50ffab")("✓"));
        });
    }

    public runVueServer(callback: CallableFunction) {
        var directory = "./";
        if (process.env.COMMAND_ARGS !== undefined && process.env.COMMAND_ARGS.split(",")[1]) {
            directory = process.env.COMMAND_ARGS.split(",")[1];
        }
        const projectRoot = Path.join(process.env.RUN_DIRECTORY, directory, "./");
        console.log(projectRoot);
        ChildProcess.exec("cd " + projectRoot + " && npx vue-cli-service serve").stdout.on("data", (data) => {
            if (data == "No issues found.\n") {
                CliSpinner.stop(Chalk.hex("#50ffab")("✓"));
                callback();
            }
        });
    }
}

const dev = new Dev();