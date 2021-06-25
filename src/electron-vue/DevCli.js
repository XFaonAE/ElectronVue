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
var DevCli = /** @class */ (function () {
    function DevCli() {
        var _this = this;
        console.log(chalk_1.default.hex("#aaa")("───"), chalk_1.default.hex("#50ffab")("| Electron Vue |"), chalk_1.default.hex("#aaa")("────────────────────"));
        cli_spinner_1.default.write("Starting VueJS development server...");
        this.startRenderer().then(function () {
            cli_spinner_1.default.stop("✓");
            cli_spinner_1.default.write("Starting window process...");
            _this.startElectron();
        });
    }
    /**
     * Start the renderer process
     * @param { string[] } options All the startup options
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
        });
    };
    return DevCli;
}());
exports.default = DevCli;
