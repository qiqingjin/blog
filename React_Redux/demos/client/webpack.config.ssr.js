const path = require('path');
const webpack = require("webpack");
const clientConfig = require('./webpack.config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = Object.assign({}, clientConfig, {
  context: path.join(__dirname, '/'),
  entry: './src/main.ssr.js',
  output: {
    path: path.join(__dirname, '../server/dist'),
    filename: "[name].ssr.js",
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [
      //...clientConfig.module.rules,
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: ['react',
              ['env', {
                // debug: true,
                "targets": {
                    node: 'current',
                    // modules: false
                }
              }]
            ]
          }
        }]
      },
      {
        test: /\.(s)?css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  optimization: {}
});