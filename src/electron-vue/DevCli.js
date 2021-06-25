"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cli_spinner_1 = __importDefault(require("@axerillc/cli-spinner"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = require("child_process");
var electron_1 = __importDefault(require("electron"));
var readline_1 = __importDefault(require("readline"));
var DevCli = /** @class */ (function () {
    function DevCli() {
        var _this = this;
        // Initialize vars
        this.electronProcess = null;
        this.readLine = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // Startup message
        console.log(chalk_1.default.hex("#fff")("───"), chalk_1.default.hex("#50ffab")("Electron Vue"), chalk_1.default.hex("#fff")("────────────────────"));
        cli_spinner_1.default.write("Starting VueJS development server...");
        // this.startRenderer().then(() => {
        cli_spinner_1.default.stop("✓");
        cli_spinner_1.default.write("Starting window process...");
        this.startElectron().then(function (electronProcess) {
            _this.electronProcess = electronProcess;
            cli_spinner_1.default.stop("✓");
            cli_spinner_1.default.fullStop();
            // Listen for user commands
            _this.listenCommands();
        });
        // });
    }
    /**
     * Prepare a command to be ready for use
     * @param { string } rawCommand Raw command
     * @return { Promise }
     */
    DevCli.prototype.prepareCommand = function (command) {
        return new Promise(function (resolve, reject) {
            var commandNew = command.split(" ");
            resolve(commandNew);
        });
    };
    /**
     * Listen to user inputted commands
     * @return { Promise }
     */
    DevCli.prototype.listenCommands = function () {
        var _this = this;
        this.readLine.question("Electron Vue > ", function (response) {
            _this.prepareCommand(response).then(function (newCommand) {
                switch (newCommand[0]) {
                    case "restart":
                        cli_spinner_1.default.write("Restarting...");
                        _this.restartElectron(_this.electronProcess).then(function (newElectronProcess) {
                            _this.electronProcess = newElectronProcess;
                            cli_spinner_1.default.stop("✓");
                        });
                        break;
                    case "stop":
                        process.exit(0);
                        break;
                }
                cli_spinner_1.default.fullStop();
                _this.listenCommands();
            });
        });
    };
    /**
     * Start the renderer process
     * @param { string[] } options All the startup options
     * @return { Promise }
     */
    DevCli.prototype.startRenderer = function (options) {
        if (options === void 0) { options = []; }
        return new Promise(function (resolve, reject) {
            // Start the renderer
            var rendererProcess = child_process_1.exec("npx webpack serve --mode development --hot", {
                cwd: path_1.default.join(__dirname, "../../")
            });
            // Check if the renderer was successful
            if (rendererProcess !== null || rendererProcess !== undefined) {
                rendererProcess.stdout.on("data", function (data) {
                    if (data == "\x1B[34mi\x1B[39m \x1B[90m｢wdm｣\x1B[39m: Compiled successfully.\n") {
                        resolve();
                    }
                });
            }
        });
    };
    /**
     * Start ElectronJS
     * @param { string[] } options All startup options
     * @return { Promise }
     */
    DevCli.prototype.startElectron = function (options) {
        if (options === void 0) { options = []; }
        return new Promise(function (resolve, reject) {
            // Start electron
            var electronProcess = child_process_1.spawn(electron_1.default, [path_1.default.join(__dirname, "../electron/ElectronMain.js")]);
            electronProcess.stdout.on("data", function (data) {
                resolve(electronProcess);
            });
        });
    };
    /**
     * Restart ElectronJS process
     * @param { any } electronProcess ElectronJS process
     * @return { Promise }
     */
    DevCli.prototype.restartElectron = function (electronProcess) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            electronProcess.kill();
            resolve(_this.startElectron().then(function (electronNewProcess) {
                return electronNewProcess;
            }));
        });
    };
    return DevCli;
}());
exports.default = DevCli;
