'use strict';

const pkgDir = require('pkg-dir').sync
const path = require('path');
const npminstall = require('npminstall');
const pahtExists = require('path-exists')

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
        this.packageName = options.packageName
        this.packageVersion = options.packageVersion

    }

    exists () {
        // if (this.storePath) {
        //     // 缓存
        // } else {
        //     return pahtExists(this.targetPath)
        // }
        return null
        // 缓存目录
    }

    install() {
        npminstall({
            root: this.targetPath,
            pkgs: [
                {
                    name: this.packageName, 
                    version: this.packageVersion
                }
            ]
        })
    }

    updatePackge() {}

    formatePath(p) {
        if (p && typeof p === 'string') {
            const {sep} = path
            if (sep === '/') {
                return p
            } else {
                return p.replace(/\\/g, '/')
            }
        }
    }

    getRootFilePath() {
        const dir = pkgDir(this.targetPath)
        console.log(dir, 'dir');
        if (dir) {
            const pkgFile = require(path.resolve(dir, 'package.json'))
            if (pkgFile && pkgFile.main) {
                return this.formatePath(path.resolve(dir, pkgFile.main))
            }
        }
        return null
    }

}


module.exports = Package;
