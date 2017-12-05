// webpack.production.config.js
const webpack = require('webpack');//添加版权声明
const HtmlWebpackPlugin = require("html-webpack-plugin");//使用模板
const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离css

module.exports = {
    entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./public", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true,
        hot: true
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        modules: true
                    }
                }, {
                    loader: "postcss-loader"
                }],
            })
        }]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
       
        new HtmlWebpackPlugin({
            //favicon:'./src/img/favicon.ico', //favicon路径
            template: __dirname + "/app/index.tmpl.html",  //html模板路径
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                 removeComments:true,    //移除HTML中的注释
                 collapseWhitespace:true    //删除空白符与换行符
             }
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),

        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:false
            },
            except:['$super', '$', 'exports', 'require']    //排除关键字
        }),
        
        new ExtractTextPlugin("style.css")

    ],
};
 