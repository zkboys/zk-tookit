// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var proxyTables = {
    // '/api/organization/users': 'http://localhost:3001', // 开发过程中，可以代理具体的url到后端开发机器上。
    // '/user/**': 'http://172.16.20.57:8080',
    // '/admins': 'http://172.16.20.57:8080',
    // '/admins/**': 'http://172.16.20.57:8080',
    // '/systems': 'http://172.16.20.57:8080',
    // '/systems/**': 'http://172.16.20.57:8080',
    // '/role/**': 'http://172.16.14.157:8080',
    // '/permission/**': 'http://172.16.14.157:8080',
};
var sourceFilePath = path.join(__dirname, '../../src');
module.exports = {
    sourceFilePath: sourceFilePath,
    routesFileName: path.join(sourceFilePath, '**/routes.js'),
    allRoutesFileName: path.join(sourceFilePath, 'all-routes.js'),
    jsxFileName: path.join(sourceFilePath, '**/*.jsx'),
    pageInitStateFileName: path.join(sourceFilePath, 'page-init-state.js'),
    pageRouteFileName: path.join(sourceFilePath, 'page-routes.js'),
    build: {
        env: require('./prod.env.js'),
        index: path.resolve(__dirname, '../../public/index.html'),
        sigin: path.resolve(__dirname, '../../public/signin.html'),
        assetsRoot: path.resolve(__dirname, '../../public'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: require('./dev.env.js'),
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: proxyTables,
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
