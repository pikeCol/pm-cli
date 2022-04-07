'use strict';

const semver = require('semver')
const colors =require('colors/safe')

const LOWEST_NODE_VERSION = '12.0.0'


class command {

    constructor(argv) {

        // 参数不能为空
        if (!argv) {
            throw new Error('argv is required')
        }
        // 参数必须为数组
        if (!Array.isArray(argv)) {
            throw new Error('argv must be an array')
        }
        // 参数列表不能为空
        if (argv.length === 0) {
            throw new Error('argv must not be empty')
        }

        this._argv = argv;
        let runner = new Promise((resolve, reject) => {
            // this.exec(argv, resolve, reject);
            let chain = Promise.resolve();
            chain = chain.then(() => this.checkNodeVersion())
            chain = chain.then(() => this.initArgv())
            chain = chain.then(() => this.init())
            chain = chain.then(() => this.exec())
            chain.catch(err => {
                console.log(err.message)
            })
        })

    }

    // 参数初始化
    initArgv() {
        this._cmd = this._argv[this._argv.length - 1]
        this._argv = this._argv.slice(0, this._argv.length - 1)
    }

    checkNodeVersion () {
        const currentVersion = process.version
        if (!semver.gte(currentVersion, LOWEST_NODE_VERSION)) {
            throw new Error(colors.red(`pm-cli 需要安装${LOWEST_NODE_VERSION} 以上的node.js`))
        }
    }

    init() {
        throw new Error('init is not implemented')
    }

    exec() {
        throw new Error('exec is not implemented')
    }
}


module.exports = command;
