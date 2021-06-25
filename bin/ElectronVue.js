#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DevCli_1 = __importDefault(require("../src/electron-vue/DevCli"));
new /** @class */ (function () {
    /**
     * Main command handler for ElectronVue
     */
    function ElectronVue() {
        // Store command arguments
        this.args = process.argv.splice(2);
        this.args = this.args.map(function (value) { return value.toLowerCase(); });
        // Run command
        switch (this.args[0]) {
            case "dev":
                new DevCli_1.default();
                break;
            default:
                console.log("Invalid argument :(");
                break;
        }
    }
    return ElectronVue;
}());
