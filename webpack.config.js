var path = require('path');
var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devtool: 'eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        //生成html文件
        new HTMLWebpackPlugin({
            //title: '上海移动开发管理系统',
            template: './index.html'
        }),
        //new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
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
                //loader: 'babel-loader?presets[]=es2015&presets[]=react',
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
