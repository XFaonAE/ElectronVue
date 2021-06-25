#!/usr/bin/env node

import DevCli from "./electron-vue/DevCli";
import setCliTitle from "node-bash-title";

new class ElectronVue {
    /**
     * CLI command arguments/parameters
     * @var { string[] }
     */
    public args: string[];

    /**
     * Started process in
     * @var { string }
     */
    public startedIn: string;

    /**
     * Main command handler for ElectronVue
     */
    public constructor() {
        // Set terminal title
        setCliTitle("Electron Vue");

        // Store command arguments
        this.args = process.argv.splice(2);
        this.args = this.args.map(value => value.toLowerCase());
        this.startedIn = process.cwd();
        
        // Run command
        switch (this.args[0]) {
            case "dev":
                new DevCli(this);
                break;

            default: 
                console.log("Invalid argument :(");
                break;
        }
    }
} 
