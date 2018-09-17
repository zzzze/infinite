var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./src/sketch.js",
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: "/build/",
    filename: "infinite.js"
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "sass-loader"}
        ]
      }, {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
  ]
}
