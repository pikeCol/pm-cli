'use strict';

const Package = require('@pm-cli/package')
const path = require('path')
const cp = require('child_process')

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
            pkg.install()
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
        try {
            // require(rootFile).call(null, Array.from(arguments))
            const argv = Array.from(arguments)
            const cmd = argv[arguments.length - 1]
            const o = Object.create(null)

            // 去除多余的参数
            Object.keys(cmd).forEach(key => {
                if (cmd.hasOwnProperty(key) && key !== 'parent' && !key.startsWith('_')) {
                    o[key] = cmd[key]
                }
            })

            argv[arguments.length - 1] = o

            let code = `require('${rootFile}').call(null, ${JSON.stringify(argv)})`
            const child = spawn('node', ['-e', code], {
                cwd: process.cwd(),
                stdio: 'inherit'
            })
            // 命令执行失败
            child.on('error', err => {
                log.error(err.message)
                process.exit(1)
            })

            // 退出事件
            child.on('exit', code => {
                if (code !== 0) {
                    log.error(`${cmdName} failed`)
                }
                process.exit(code)
            })


        } catch (err) {
            log.err(err.message)
        }
            
    }

    // console.log(pkg.getRootFilePath());
}

// spawn兼容win32
function spawn (command, args, options) {
    const win32 = process.platform === 'win32'
    const cmd = win32 ? `cmd` : command
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args

    return cp.spawn(cmd, cmdArgs, options || {})
}


module.exports = exec;
