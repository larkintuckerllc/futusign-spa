// eslint-disable-next-line
const autoprefixer = require('autoprefixer');
// eslint-disable-next-line
const webpack = require('webpack');
const path = require('path');
// eslint-disable-next-line
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line
const AppCachePlugin = require('appcache-webpack-plugin');
// eslint-disable-next-line
const CleanWebpackPlugin = require('clean-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src', 'index.html'),
  filename: 'index.html',
  inject: 'body',
  chunks: ['main'],
});
module.exports = {
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },
  devtool: 'eval',
  entry: {
    main: path.join(__dirname, 'src', 'index.jsx'),
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/player/',
  },
  module: {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.(ico|pdf)$/,
      loader: 'file-loader?name=[name].[ext]',
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'url-loader?limit=10000',
    }, {
      test: /\.(eot|ttf|wav|mp3)$/,
      loader: 'file-loader',
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?module&-autoprefixer', 'postcss'],
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?module&-autoprefixer', 'postcss', 'sass'],
    }, {
      // eslint-disable-next-line
      test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
      loader: 'imports-loader?jQuery=jquery',
    }],
  },
  postcss: () =>
    [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
      }),
    ],
  plugins: [
    new CleanWebpackPlugin(['dist']),
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new AppCachePlugin({
      exclude: [
        /.*\.map$/,
      ],
      output: 'index.appcache',
    }),
  ],
  devServer: {
    inline: true,
    port: 8086,
  },
};
