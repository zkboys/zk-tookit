const webpack = require('webpack');
const path = require('path');

const vendors = [
    'antd',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux',
    'redux-thunk',
];

module.exports = {
    output: {
        path: path.join(__dirname, 'dll'),
        filename: '[name].[chunkhash].js',
        library: '[name]_[chunkhash]',
    },
    entry: {
        dll: vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll', 'manifest.json'),
            name: '[name]_[chunkhash]',
            context: __dirname,
        }),
    ],
};