'use strict';

const Package = require('@pm-cli/package')

function index() {
    const targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME
    const cmdObj = arguments[arguments.length - 1]
    console.log(cmdObj.name());
    const name = cmdObj.name()
    const packageVersion = 'lasest'
    // console.log(this.opts());
    // TODO
    const pkg = new Package({
        targetPath,
        name,
        packageVersion
    })

    console.log(pkg.getRootFilePath());
}


module.exports = index;
