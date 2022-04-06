'use strict';

const Package = require('@pm-cli/package')
const path = require('path')

const CACAHE_DIR = 'dependencies'
const SETTINTS = {
    init: 'pm-cli/init'
}

function exec() {
    console.log('exec')
    let targetPath = process.env.CLI_TARGET_PATH
    const homePath = process.env.CLI_HOME

    const cmdObj = arguments[arguments.length - 1]
    console.log(targetPath, 'targetPath');
    console.log(homePath, 'homePath');
    const cmdName = cmdObj.name()
    const packageVersion = 'lasest'
    const packageName = SETTINTS[cmdName]

    let pkg
    let storeDir = ''

  

    if (!targetPath) { 
        targetPath = path.resolve(homePath, CACAHE_DIR) // 生成缓存路径
        storeDir = path.resolve(targetPath, 'node_modules')
        console.log('targetPath', targetPath);
        console.log('storeDir', storeDir);
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion
        })
        if (pkg.exists()) {
            // 更新package
        } else {
            // 安装package
            // pkg.install()
            console.log('安装package');
        }
    
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion
        })
    
    }

    const rootFile = pkg.getRootFilePath()
    console.log(rootFile, 'rootFile');
    if (rootFile) {
        require(rootFile).apply(null, arguments)
    }

    console.log(pkg.getRootFilePath());
}


module.exports = exec;
