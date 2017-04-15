// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var fs = require('fs');
var program = require('commander');

// 从命令行里面获取配置文件
var dest = process.cwd();//返回运行当前脚本的工作目录的路径。
program
    .option('-c, --config <value>', 'set config')
    .parse(process.argv);

var defaultConfigFile = './zk-config'; // 默认配置文件名，要放在脚本运行目录下。
var configPath = path.join(dest, program.config || defaultConfigFile);
var config = require(configPath);

fs.writeFileSync(path.join(config.projectRoot, 'config.js'), fs.readFileSync(configPath));

var srcPath = config.srcPath;
module.exports = {
    staticPath: config.staticPath,
    projectRoot: config.projectRoot,
    babelImport: config.babelImport,
    htmlOptions: config.htmlOptions,
    webpack: config.webpack,
    sourceFilePath: srcPath,
    jsxFileName: path.join(srcPath, '**/*.jsx'),
    routesFileName: path.join(srcPath, '**/routes.js'),
    allRoutesFileName: path.join(__dirname, '../route/all-routes.js'),
    pageInitStateFileName: path.join(__dirname, '../redux/page-init-state.js'),
    pageRouteFileName: path.join(__dirname, '../route/page-routes.js'),
    build: {
        env: '"production"',
        assetsRoot: config.assetsRoot,
        assetsSubDirectory: 'static',
        assetsPublicPath: config.assetsPublicPath,
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: '"development"',
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: config.proxyTables,
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
