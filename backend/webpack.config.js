const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const nodeModules = fs.readdirSync('node_modules').filter(x => x !== '.bin');
module.exports = [{
  target: 'node',
  cache: 'true',
  devtool: 'eval-source-map',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'package.json' },
      { from: 'pm2.config.json' },
      { from: 'yarn.lock' },
      { from: 'config', to: 'config' },
      { from: 'migrations', to: 'migrations' },
    ]),
  ],
}];
