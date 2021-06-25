#!/usr/bin/env node

import DevCli from "../src/electron-vue/DevCli";

new class ElectronVue {
    /**
     * CLI command arguments/parameters
     * @var { string[] }
     */
    public args: string[];

    /**
     * Main command handler for ElectronVue
     */
    public constructor() {
        // Store command arguments
        this.args = process.argv.splice(2);
        this.args = this.args.map(value => value.toLowerCase());
        
        // Run command
        switch (this.args[0]) {
            case "dev":
                new DevCli();
                break;

            default: 
                console.log("Invalid argument :(");
                break;
        }
    }
} 
