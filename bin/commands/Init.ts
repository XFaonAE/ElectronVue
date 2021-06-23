const { CliSpinner } = require("@axerillc/clispinner");
const ChildProcess = require("child_process");
const Chalk = require("chalk");
const FileSystem = require("fs");
const Path = require("path");

class Init {
    public args: string[] | undefined;

    public cwd: string | undefined;

    constructor() {
        this.args = [];
        CliSpinner.write("Preparing to initialize project...");
        this.args = process.env.COMMAND_ARGS?.split(",");
        this.cwd = process.env.RUN_DIRECTORY;
        this.start();
    }

    public start() {
        CliSpinner.stop(Chalk.hex("#50ffab")("✓"));
        CliSpinner.write("Creating development scripts...");

        if (this.args !== undefined && this.args[1]) {
            this.initDir(this.args[1]);
        } else {
            this.initDir("./");
        }
    }

    public initDir(directory: string) {
        FileSystem.mkdir(Path.join(this.cwd, directory, ".electron-vue"), { recursive: true }, (error) => {});
        FileSystem.readFile(Path.join(__dirname, "resources/Dev.ts"), "utf8", (error, data) => {
            FileSystem.writeFile(Path.join(this.cwd, directory, ".electron-vue/Dev.ts"), data, (error) => {
                CliSpinner.stop(Chalk.hex("#50ffab")("✓"));
                CliSpinner.fullStop();
            });
        });
    }
}

const init = new Init();