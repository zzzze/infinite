var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry:"./src/sketch.js",
    output:{
        path:"./build/",
        filename:"./infinite.js"
    },
    // devtool: "source-map",
    module: {
        loaders: [
        //    {
        //         test: /\.css$/,
        //         loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")
        //     },
        //     {
        //         test: /\.less$/,
        //         loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader?sourceMap")
        //     },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader?sourceMap")    //为什么是这样，尝试了一个下午啊！！！！！终于成功了
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        // new webpack.optimize.UglifyJsPlugin({             //压缩
        //     compress: {
        //         warnings: false
        //     }
        // }),
    ]
}
