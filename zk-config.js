const path = require('path');

module.exports = {
    proxyTables: {
        // '/api/organization/users': 'http://localhost:3001', // 开发过程中，可以代理具体的url到后端开发机器上。
        // '/user/**': 'http://172.16.20.57:8080',
        // '/admins': 'http://172.16.20.57:8080',
        // '/admins/**': 'http://172.16.20.57:8080',
        // '/systems': 'http://172.16.20.57:8080',
        // '/systems/**': 'http://172.16.20.57:8080',
        // '/role/**': 'http://172.16.14.157:8080',
        // '/permission/**': 'http://172.16.14.157:8080',
    },
    projectRoot: path.join(__dirname, './'),
    srcPath: path.join(__dirname, './src'),
    staticPath: path.join(__dirname, './static'), // 非webpack构建的静态文件存放目录
    assetsRoot: path.join(__dirname, './public'), // webpack 构建生成文件存放路径
    assetsPublicPath: '/', // webpack build 构建时，静态文件cdn
    htmlOptions: { // HtmlWebpackPlugin 所需的一些配置
        app: {
            template: path.join(__dirname, './index.html'),
            fileName: 'index.html',
            favicon: path.join(__dirname, './favicon.png'),
            title: '管理系统',
        },
        signIn: {
            template: path.join(__dirname, './signin.html'),
            fileName: 'signin.html',
            favicon: path.join(__dirname, './favicon.png'),
            title: '登录',
        },
    },
    webpack: { // webpack 配置 分为 base（通用） dev（开发） prod（生产）
        base: {
            entry: {
                app: path.join(__dirname, './src/App.jsx'),
                signIn: path.join(__dirname, './src/pages/sign-in/sign-in.js'),
            },
        },
    },
    babelImport: [{libraryName: 'antd', style: 'css'}],
};
