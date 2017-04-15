var path = require('path')
var webpack = require('webpack')
var config = require('./config')
var utils = require('./utils')
var projectRoot = config.projectRoot;
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var babelPlugins = ['add-module-exports', 'typecheck', 'transform-runtime', ["import", config.babelImport]];
if (process.env.NODE_ENV === 'testing') {
    babelPlugins.unshift('__coverage__');
}

var babelQuery = {
    cacheDirectory: true,
    presets: ['es2015', 'react', 'stage-0'],
    plugins: babelPlugins,
    comments: false
};

module.exports = {
    cache: true,
    entry: config.webpack.base.entry,
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: config.webpack.base.alias,
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        preLoaders: [
            {
                test: /\.js(x)*$/,
                loader: 'eslint',
                include: projectRoot,
                exclude: /(node_modules|routes.js)/
            },
            {
                test: /routes\.js$/,
                loader: path.join(__dirname, './routes-loader') + '!eslint',
                include: projectRoot,
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js(x)*$/,
                loader: 'babel',
                // include: projectRoot,
                // exclude: /node_modules/,
                query: babelQuery
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap&-restructuring!' + 'postcss-loader')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!' + 'postcss-loader!' + 'less?{"sourceMap":true,"modifyVars":{}}')
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css'), {
            disable: false,
            allChunks: true
        }),
    ],
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    // // TODO 文件大小有改变，但是速度并没有提升
    /*plugins: [
     new webpack.DllReferencePlugin({
     context: __dirname,
     manifest: require('./dll/manifest.json'),
     }),
     ],*/
}
