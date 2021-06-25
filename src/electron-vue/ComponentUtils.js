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
     * Load asset
     * @param { string } outDir Output directory name
     * @param { string } inPath Exact file path for asset
     */
    ComponentUtils.loadAsset = function (outPath, inPath) {
        var assetRaw = fs_1.default.readFileSync(inPath);
        fs_1.default.writeFile(path_1.default.join(__dirname, "../vue/", outPath), assetRaw, function (error) {
            error === null || error === void 0 ? void 0 : error.console.log(error);
        });
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
                _this.loadAsset(path_1.default.join("components", value), path_1.default.join(config.componentsDir, value));
            });
            views.forEach(function (value) {
                _this.loadAsset(path_1.default.join("views", value), path_1.default.join(config.viewsDir, value));
            });
            fs_1.default.writeFile(path_1.default.join(__dirname, "../vue/Main.vue"), mainVueSfc, function (error) {
                error === null || error === void 0 ? void 0 : error.console.log(error);
            });
            _this.startLookOut(config);
            resolve();
        });
    };
    /**
     * Start lookout file system
     */
    ComponentUtils.startLookOut = function (config) {
        var _this = this;
        // Listen to each file category
        fs_1.default.watch(config.componentsDir, function (type, filename) {
            _this.loadAsset(path_1.default.join("components", filename), path_1.default.join(config.componentsDir, filename));
        });
        fs_1.default.watch(config.viewsDir, function (type, filename) {
            _this.loadAsset(path_1.default.join("views", filename), path_1.default.join(config.viewsDir, filename));
        });
        fs_1.default.watch(config.vueMainSfcPath, function (type, filename) {
            _this.loadAsset(path_1.default.join("./", "Main.vue"), filename);
        });
    };
    return ComponentUtils;
}());
exports.default = ComponentUtils;
