const webpack = require('webpack');
const merge = require('webpack-merge')
const common = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // new MiniCssExtractPlugin({
        //     // 类似 webpackOptions.output里面的配置 可以忽略
        //     filename: 'ayto_date.min.css',
        //     chunkFilename: 'xixi.css',
        // }),
    ],
    module: {
        // rules: [
        //     {
        //         test: /\.(sa|sc|c)ss$/,
        //         use: [
        //             MiniCssExtractPlugin.loader,
        //             'css-loader',
        //             'sass-loader',
        //         ],
        //     }
        // ]
    }
});