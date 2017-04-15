// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack
process.env.NODE_ENV = 'testing'
var path = require('path')
var merge = require('webpack-merge')
var baseConfig = require('../../build/webpack.base.conf')
var utils = require('../../build/utils')
var webpack = require('webpack')

var webpackConfig = merge(baseConfig, {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'css'
            },
            {
                test: /\.less$/,
                loader: 'css!less'
            },
        ]
    },
    externals: { // this for enzyme, For more detail see http://airbnb.io/enzyme/docs/guides/karma.html
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../../build/config/test.env')
        })
    ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = function (config) {
    config.set({
        // to run in additional browsers:
        // 1. install corresponding karma launcher
        //    http://karma-runner.github.io/0.13/config/browsers.html
        // 2. add it to the `browsers` array below.
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'sinon-chai'],
        reporters: ['spec', 'coverage'],
        files: ['./index.js'],
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        extensions: ['.es6', '.jsx', '.js'],
        plugins: [
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-spec-reporter',
            'karma-coverage',
            'karma-mocha',
            'karma-sinon-chai',
            'karma-phantomjs-launcher',
        ],
        coverageReporter: {
            dir: './coverage',
            reporters: [
                {type: 'lcov', subdir: '.'},
                {type: 'text-summary'}
            ]
        }
    })
}
