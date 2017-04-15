// https://github.com/shelljs/shelljs
require('shelljs/global')

var path = require('path')
var config = require('./config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.dll.conf')

var spinner = ora('building for dll...')
spinner.start()

webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n')
})
