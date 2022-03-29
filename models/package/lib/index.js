'use strict';

const pkgDir = require('pkg-dir').sync

class Package {

    constructor (options) {
        // targetPath
        if (!options || Object.prototype.toString.call(options) === '[object object]') {
            throw new Error("Package类的option不能为空")
        }
        console.log('package exec')
        this.targetPath = options.targetPath
        // package 存储路劲
        this.storePath = options.storePath
        this.name = options.name
        this.packageVersion = options.packageVersion

    }

    exists () {}

    install() {}

    updatePackge() {}

    getRootFilePath() {
        const dir = pkgDir(this.targetPath)
        return dir
    }

}


module.exports = Package;
