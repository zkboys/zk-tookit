var config = require('./config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./builder/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            chunks: ['app'],
            favicon: 'favicon.png',
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            csrf: '<%= csrf %>'
        }),
        new HtmlWebpackPlugin({
            chunks: ['signIn'],
            favicon: 'favicon.png',
            filename: 'signin.html',
            template: 'signin.html',
            inject: true,
            csrf: '<%= csrf %>'
        })
    ]
})
