"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ComponentUtils = /** @class */ (function () {
    function ComponentUtils() {
    }
    /**
     * Get a list of all the components in the project working directory
     * @param { string[] } config Working directory config
     * @return { string[] }
     */
    ComponentUtils.getAllComponents = function (config) {
        // Return all file names
        return fs_1.default.readdirSync(config.componentsDir);
    };
    /**
     * Get a list of all the views in the project working directoryvar
     * @param { string[] } config Working directory config
     * @return { string[] }
     */
    ComponentUtils.getAllViews = function (config) {
        // Return all file names
        return fs_1.default.readdirSync(config.viewsDir);
    };
    /**
     * Load all key files
     * @param { string[] } config Working directory config
     * @return { Promise }
     */
    ComponentUtils.loadAllKeys = function (config) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Get app files
            var components = _this.getAllComponents(config);
            var views = _this.getAllViews(config);
            var mainVueSfc = fs_1.default.readFileSync(config.vueMainSfcPath);
            // Fill content to real source vue dir
            components.forEach(function (value) {
                fs_1.default.writeFile(path_1.default.join(__dirname, "../vue/components/", value), fs_1.default.readFileSync(path_1.default.join(config.componentsDir, value)), function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            });
            views.forEach(function (value) {
                fs_1.default.writeFile(path_1.default.join(__dirname, "../vue/views", value), fs_1.default.readFileSync(path_1.default.join(config.viewsDir, value)), function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            });
            fs_1.default.writeFile(path_1.default.join(__dirname, "../vue/Main.vue"), mainVueSfc, function (error) {
                if (error) {
                    console.log(error);
                }
            });
            console.log("Filed copied");
            resolve();
        });
    };
    return ComponentUtils;
}());
exports.default = ComponentUtils;
