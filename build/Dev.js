"use strict";
var CliSpinner = require("@axerillc/clispinner").CliSpinner;
var Dev = /** @class */ (function () {
    function Dev() {
        CliSpinner.write("Starting development server...");
    }
    return Dev;
}());
var dev = new Dev();
