const { CliSpinner } = require("@axerillc/clispinner");
const ChildProcess = require("child_process");
const Path = require("path");

class Dev {
    public constructor() {
        CliSpinner.write("Starting ElectronJS...");
        this.runElectron();
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

    public runVueServer() {
        const projectRoot = Path.join(process.env.RUN_DIRECTORY, directory, "./");
    }
}

const dev = new Dev();