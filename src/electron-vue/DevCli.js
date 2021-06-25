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
var ComponentUtils_1 = __importDefault(require("./ComponentUtils"));
var DevCli = /** @class */ (function () {
    /**
     * ElectronVue development command script
     * @param { any } electronVue ElectronVue instance
     * @returns { null }
     */
    function DevCli(electronVue) {
        var _this = this;
        // Initialize vars
        this.electronVue = electronVue;
        this.electronProcess = null;
        this.vueProcess = "not started";
        this.readLine = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.projectConfig = require(path_1.default.join(this.electronVue.startedIn, "electron-vue.config.js"));
        // Startup message
        console.log(chalk_1.default.hex("#555")("────"), chalk_1.default.hex("#fff")("Electron Vue"), chalk_1.default.hex("#555")("────────────────────"));
        var runElectronLogic = function () {
            cli_spinner_1.default.write("Starting window process...");
            _this.startElectron().then(function (electronProcess) {
                _this.electronProcess = electronProcess;
                cli_spinner_1.default.stop("✓");
                cli_spinner_1.default.fullStop();
                // Listen for user commands
                _this.listenCommands();
            });
        };
        // Run ElectronJS main if skip renderer is true
        if (this.electronVue.args[1] == "true") {
            runElectronLogic();
            return;
        }
        // Start VueJS renderer then ElectronJS
        cli_spinner_1.default.write("Starting VueJS development server...");
        this.startRenderer().then(function (vueProcess) {
            _this.vueProcess = vueProcess;
            cli_spinner_1.default.stop("✓");
            runElectronLogic();
        });
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
        // Listen to a command
        this.readLine.question("Electron Vue > ", function (response) {
            _this.prepareCommand(response).then(function (newCommand) {
                switch (newCommand[0]) {
                    case "restart":
                        cli_spinner_1.default.write("Restarting...");
                        _this.restartElectron(_this.electronProcess).then(function (newElectronProcess) {
                            _this.electronProcess = newElectronProcess;
                            cli_spinner_1.default.stop("✓");
                            _this.listenCommands();
                        });
                        break;
                    case "get":
                        switch (newCommand[1]) {
                            case "config":
                                console.log(_this.projectConfig);
                                _this.listenCommands();
                                break;
                            case "components":
                                console.log(ComponentUtils_1.default.getAllComponents(_this.projectConfig));
                                _this.listenCommands();
                                break;
                        }
                        break;
                    case "start":
                        switch (newCommand[1]) {
                            case "renderer":
                                if (_this.vueProcess != "not started") {
                                    console.log(chalk_1.default.hex("#ff7777")("[ Error ]"), "The renderer is already running and cannot be restarted");
                                }
                                else {
                                    _this.vueProcess = "starting...";
                                    cli_spinner_1.default.write("Starting VueJS development server...");
                                    _this.startRenderer().then(function (vueProcess) {
                                        _this.vueProcess = vueProcess;
                                        cli_spinner_1.default.stop("✓");
                                        cli_spinner_1.default.write("Restarting ElectronJS...");
                                        _this.restartElectron(_this.electronProcess).then(function (newElectronProcess) {
                                            _this.electronProcess = newElectronProcess;
                                            cli_spinner_1.default.stop("✓");
                                            _this.listenCommands();
                                        });
                                    });
                                }
                                break;
                            case "vue-update-assets":
                                ComponentUtils_1.default.loadAllKeys(_this.projectConfig);
                                break;
                        }
                        break;
                    case "stop":
                        process.exit(0);
                        break;
                }
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
        var _this = this;
        if (options === void 0) { options = []; }
        return new Promise(function (resolve, reject) {
            // Start the renderer
            ComponentUtils_1.default.loadAllKeys(_this.projectConfig).then(function () {
                var _a;
                var rendererProcess = child_process_1.exec("npx webpack serve --mode development --hot", {
                    cwd: path_1.default.join(__dirname, "../../")
                });
                // Check if the renderer was successful
                (_a = rendererProcess.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (data) {
                    if (data == "\x1B[34mi\x1B[39m \x1B[90m｢wdm｣\x1B[39m: Compiled successfully.\n") {
                        resolve(rendererProcess);
                    }
                });
            });
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
