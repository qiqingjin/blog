const path = require('path');
const clientConfig = require('../client/webpack.config');

module.exports = Object.assign({}, clientConfig, {
  context: path.join(__dirname, '../client'),
  entry: {
    index: './src/main.jsx'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].ssr.js",
    libraryTarget: 'commonjs2'
  }
});