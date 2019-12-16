const merge = require('webpack-merge');
const common = require('./webpack.common')
const webpack = require('webpack');

module.exports = merge(common, {
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    }
});