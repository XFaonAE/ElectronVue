#!/usr/bin/env node

const Path = require("path");
const TypeScript = require("typescript");
const FileSystem = require("fs");

class ElectronVue {
    constructor() {
        this.args = process.argv.splice(2);
        this.commandHandle();
    }

    commandHandle() {
        switch (this.args[0]) {
            case "dev": 
                this.runCommand("Dev");
                break;
            
            case "init":
                this.runCommand("Init");
                break;
            
            default:
                this.runCommand("Help");
                break;
        }
    }

    runCommand(name) {
        FileSystem.readFile(Path.join(__dirname, "./commands/" + name + ".ts"), "utf8", (error, data) => {
            process.env.COMMAND_ARGS = this.args;
            process.env.RUN_DIRECTORY = process.cwd();
            eval(TypeScript.transpileModule(data, { }).outputText);
        });
    }
}

const electronVue = new ElectronVue();