const path = require("path");

//引用webpack
const webpack = require('webpack');


//自动生成html
const HtmlWebpackPlugin = require("html-webpack-plugin");
 

//postcss-loader 需要的配置项
var precss       = require('precss');
var autoprefixer = require('autoprefixer');



//分离css
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCss = new ExtractTextPlugin("css/[name].[contenthash].css");

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});


module.exports = {
    entry: {
        main: path.join(__dirname , "/src/script/main.js"),
        //a:    path.join(__dirname , "/src/script/a.js"),
        //b:    path.join(__dirname , "/src/script/b.js"),
        //c:    path.join(__dirname , "/src/script/c.js"),
        //inline:    path.join(__dirname , "/src/script/inline.js"),
    },
    output: {
        path: path.join(__dirname, "/build"),//打包后的文件存放的地方
        filename: "js/[name]-[hash].js",//打包后输出文件的文件名
        publicPath:"", //上线地址 http://cdn.com
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./build",//本地服务器所加载的页面所在的目录
        port: "8080",
        historyApiFallback:true,//不跳转
        inline:true, //实时刷新
        hot: true
    },
    module: {
        rules: [
            // 配置es6,react编译规则 
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/ 
            },
            // 配置css编译规则 
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader",options: {modules: true}},
                        {loader: "postcss-loader"}
                    ],
                })
            },

            // 配置scss编译规则
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader"}, 
                        { loader: 'postcss-loader', options: { sourceMap: true } },
                        {loader: "sass-loader"}
                    ],
                        
                })
            },
            //handle template file
            {
                test: /\.html$/,
                loader: 'html-loader',
                query: {
                minimize: true
                }
            },

            //handle template file
            {
                test: /\.tpl$/,
                loader: 'ejs-loader',
            },
        
            //配置图片加载器,将较小的图片转成base64，减少http请求
            {
                test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
                //loader: 'url-loader?limit=8192&name=./images/[name]-[hash].[ext]',
              
                loader: "url-loader",
                query: {
                    limit: 8192,
                    name: "./images/[name].[ext]?[hash]"
                }
            }
            
        ]
    },
    plugins: [
        //new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.tmpl.html",  //html模板路径
            filename: "index.html",
            title: "This is index.html page",
            //favicon:'./src/img/favicon.ico', //favicon路径
            //chunks:["main"],
            inject:true,    //允许插入位置，包括head,body,true
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                 removeComments:false,    //移除HTML中的注释
                 collapseWhitespace:false,  //删除空白符与换行符
             }
        }),
        // new HtmlWebpackPlugin({
        //     template: __dirname + "/src/index.tmpl.html",  
        //     filename: "a.html",
        //     title: "This is a.html page",
        //     inject:true,    
        //     hash:true,
        //     chunks:["main","a"],     
        //     minify:{   
        //          removeComments:false,     
        //          collapseWhitespace:false,   
        //      }
        // }),
        // new HtmlWebpackPlugin({
        //     template: __dirname + "/src/index.tmpl.html",  
        //     filename: "b.html",
        //     title: "This is b.html page",
        //     inject:true,    
        //     hash:true,  
        //     chunks:["b"],      
        //     minify:{    
        //          removeComments:false,    
        //          collapseWhitespace:false,  
        //      }
        // }),
        // new HtmlWebpackPlugin({
        //     template: __dirname + "/src/index.tmpl.html",  
        //     filename: "c.html",
        //     title: "This is c.html page",
        //     inject:true,    
        //     hash:true,  
        //     excludeChunks:["main"],    
        //     minify:{     
        //          removeComments:false,     
        //          collapseWhitespace:false,   
        //      }
        // }),
        
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        //new webpack.optimize.OccurrenceOrderPlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        extractCss,
        extractSass

    ],
    
}