/*
 * Copyright 2016 Asiainfo Technologies(China),Inc. All rights reserved.
 *
 */

var path = require('path');
var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    debug: false,
    devtool: false,
    //entry: './src/index',
    entry: {
        app: "./src/index",
        vendor: ["antd"],
//        vendor: ["antd","echarts-for-react","react-syntax-highlighter","react-codemirror"],
    },
    output: {
        path: path.join(__dirname, 'dist'),
//        filename: 'bundle.js',
        filename: 'bundle-[name].js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
             names: ["vendor"],
        //     //filename: '[name].js',
             minChunks: Infinity
         }),
        //new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
        //生成html文件
        new HTMLWebpackPlugin({
            //title: '上海移动开发管理系统',
            //template: './index.html',
            template: './index-prod.html',
            // chunks:['app','vendor1']
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.DedupePlugin(),//dedupe similar code
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),//minify everything
        //new webpack.NoErrorsPlugin(),
        //new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
        //new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}), //Limit the maximum chunk count with
        //new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}), //Limit the minimum chunk size with
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname
            }, {
                test: /\.jsx?$/,
                loaders: ['babel'],
                //loader: 'jsx-loader?harmony',
                exclude: /node_modules/,
                include: __dirname
            }, {
                test: /\.less?$/,
//                loader: "style!css?module&localIdentName=[hash:base64:5]&-url"
                loaders: [
                    'style-loader',
                    'css-loader',
                    'less-loader?{"sourceMap":true}'
                ],
                include: __dirname
            },{
                test: /\.css$/,
                loader: "style!css?module&localIdentName=[hash:base64:5]&-url"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'url',
                query: {limit: 10240}
            }
        ]
    }
};
