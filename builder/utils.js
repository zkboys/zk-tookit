var path = require('path');
var glob = require('glob');
var config = require('./config');

function assetsPath(_path) {
    var assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

/**
 * 根据文件的绝对路径，生成所需的所有import 和 moduleName
 * @param sourceFilePath
 * @param targetFileName
 * @returns {{imports: Array, modules: Array}}
 */
function getImportsAndModules(sourceFilePath, targetFileName, filter, star) {
    filter = filter || function () {
            return true
        };
    var imports = [];
    var modules = [];
    var files = glob.sync(sourceFilePath);
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (filter && filter(file)) {
                var filePath = path.relative(targetFileName, file);
                var importStr = getImportStr(filePath, star);
                var moduleName = getModuleName(filePath);
                imports.push(importStr);
                modules.push(moduleName);
            }
        }
    }
    return {
        imports: imports,
        modules: modules,
    }
}

/**
 * 根据文件的相对路径，生成import 所需字符串
 * @param pathName
 * @param filePackage
 * @param ext
 * @returns {string}
 */
function getImportStr(pathName, star) {
    var pName = getModuleName(pathName);
    pathName = getPathName(pathName);
    if (star) {
        return "import * as " + pName + " from '" + pathName + "';";
    }
    return "import " + pName + " from '" + pathName + "';";
}

/**
 * 获取文件相对路径名，用于引入等
 * @param pathName
 */
function getPathName(pathName) {
    var extName = path.extname(pathName);
    pathName = pathName.replace(extName, '');
    if (process.platform.indexOf('win') >= 0) {
        pathName = pathName.replace(/\\/g, "\/");
    }
    // pathName = pathName.replace('../', '');
    return pathName;
}
/**
 * 根据文件的相对路径，生成moduleName
 * @param pathName
 * @param ext
 * @returns {string}
 */
function getModuleName(pathName) {
    var extName = path.extname(pathName);
    pathName = pathName.replace(extName, '');
    pathName = pathName.split(path.sep);
    var pName = '';
    pathName.forEach(function (p) {
        if (p) {
            var ps = p.split('-');
            ps.forEach(function (v) {
                pName += v.replace(/(\w)/, function (v) {
                    return v.toUpperCase()
                });
            });
        }
    });
    pName = pName.replace(/\./g, '');
    return pName;
}

/**
 * 删除数组中某个元素
 * @param arr
 * @param item
 */
function arrayRemove(arr, item) {
    var itemIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            itemIndex = i;
            break;
        }
    }
    if (itemIndex > -1) {
        arr.splice(itemIndex, 1);
    }
}

exports.assetsPath = assetsPath;
exports.arrayRemove = arrayRemove;
exports.getImportStr = getImportStr;
exports.getModuleName = getModuleName;
exports.getPathName = getPathName;
exports.getImportsAndModules = getImportsAndModules;