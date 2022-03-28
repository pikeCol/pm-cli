
const semver = require('semver')
const colors =require('colors/safe')
const rootCheck = require('root-check')
const commonder = require('commander')


const path = require('path')
const pkg = require('../package.json') 
const constant = require('./constant')
const userHome = require('user-home')
const pahtExists = require('path-exists').sync
const log = require('@pm-cli/log')
const minimist = require('minimist')
const pathExists = require('path-exists').sync


let args
let config
const program = new commonder.Command()


function checkPkgVersion () {
    log.notice('cli', pkg.version)
}

function checkNodeVersion () {
    const currentVersion = process.version
    const lowestVerion = constant.LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVerion)) {
        throw new Error(colors.red(`pm-cli 需要安装${lowestVerion} 以上的node.js`))
    }
}

function checkRoot () {
    rootCheck()
}

function checkInputArgs () {
    args = minimist(process.argv.slice(2))
    checkArgs()
}

function checkArgs () {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}

function checkHome () {
    if (!userHome || !pahtExists(userHome)) {
        throw new Error(colors.red('当前用户主目录不存在'))
    }
}

function checkEnv() {
    const dotenv = require('dotenv')
    const envPath = path.resolve(userHome, '.env')

    if (pathExists(envPath)) {        
        dotenv.config({
            path: envPath
        })
    }
    config =  createDefaultConfig()
    // log.verbose('环境变量', config, process.env.DB_USER)
}

function createDefaultConfig () {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME = cliConfig.cliHome
    return cliConfig
}


function registerCommonder () {
    program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .option('-d, --debug', '是否开启调试模式', false)
    .version(pkg.version)


    program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action((projectName, cmdObj) => {
        console.log('init', projectName, cmdObj)
    })


    program.on('option:debug', function() {
        if (program.debug) {
            process.env.LOG_LEVEL = 'verbose'
        } else {
            process.env.LOG_LEVEL = 'info'
        }
        log.level = process.env.LOG_LEVEL
    })

    program.on('commond:*', function(obj) {
        const avaiableCommond = program.command.map(v => v.name())
        console.log(colors.red('未知的命令' + obj[0]))
        console.log(colors.red('可用的命令' + avaiableCommond.join(',')))
    })

    program.parse(process.argv)

    if (program.args && program.args.length < 1) {
        program.outputHelp()
    }
}



function core() {
    try {        
        checkPkgVersion()
        checkNodeVersion()
        checkHome()
        checkRoot()
        checkInputArgs()
        checkEnv()
        registerCommonder()
    } catch (e) {
        log.error(e.message)
    }

}





module.exports = core;

