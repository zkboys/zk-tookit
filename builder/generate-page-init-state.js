/* eslint-disable */
var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var config = require('../config');

var sourceFilePath = config.sourceFilePath;
var sourceFileName = config.jsxFileName;
var targetFileName = config.pageInitStateFileName;

var imports = [];
var modules = [];
exports.handlePageInitStateWatch = function (event, pathName) {
    if (!hasInitState(pathName)) return;
    pathName = pathName.replace(sourceFilePath, '..');
    console.log(event, pathName);
    var im = utils.getImportStr(pathName, true);
    var pn = utils.getModuleName(pathName);
    if (event === 'add') {
        imports.push(im);
        modules.push(pn);
        writeAllInitState(imports, modules, targetFileName);
    }
    if (event === 'unlink') {
        utils.arrayRemove(imports, im);
        utils.arrayRemove(modules, pn);
        writeAllInitState(imports, modules, targetFileName);
    }
}

exports.generateAllInitState = function () {
    var result = utils.getImportsAndModules(sourceFileName, targetFileName, hasInitState, true);
    var imports = result.imports;
    var modules = result.modules;
    writeAllInitState(imports, modules, targetFileName);
}

function writeAllInitState(imports, routesNames, targetFileName) {
    // 拼接写入文件的内容
    var fileString = imports.join('\n');
    routesNames = routesNames.map(getExportItem);
    fileString += '\n\nexport default {\n    ';
    fileString += routesNames.join(',\n    ');
    fileString += '\n};\n';
    fs.writeFileSync(targetFileName, fileString);
}

function getExportItem(rn) {
    return '[' + rn + '.PAGE_SCOPE]: ' + rn + '.INIT_STATE';
}

function hasInitState(file) {
    try { // file 文件有可能不存在，会导致webpack停掉
        var fileStr = fs.readFileSync(file);
        // FIXME 这个判断可能不准确
        return fileStr.indexOf('export const INIT_STATE') > 0;
    } catch (e) {
        return true; // 文件被移除之后，也算他没有INIT_STATE
    }
}
