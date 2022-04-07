'use strict';


const Command = require("@pm-cli/command")
const log = require('@pm-cli/log')

class InitCommand extends Command {
    init () {
        this.projectName = this._argv[0] || ''
        this.force = !this._cmd.force
        log.verbose(this.force, 'force');
        log.verbose(this.projectName, 'projectName');
    }
    exec () {}
}

function init (argv) {
    return new InitCommand(argv)
}

module.exports = init

module.exports.InitCommand = InitCommand;
