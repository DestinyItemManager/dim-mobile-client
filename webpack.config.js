/* eslint-env node */
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

var root = __dirname;
// var node = path.resolve(root, 'node_modles');
var src = path.resolve(root, 'src');
var dist = path.resolve(root + '/www');

var build = {
  prod: false
};

module.exports = {
  entry: {
    vendors: [
      'ionic',
      'angular',
      'angular-animate',
      'angular-sanitize',
      'angular-ui-router',
      'ionic-angular',
      'ng-cordova'
    ],
    polyfill: 'babel-polyfill',
    bundle: path.resolve(src, 'index.js')
  },
  debug: true,
  eslint: {
    configFile: path.resolve(root, '.eslintrc')
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [path.resolve(root, 'node_modules')],
      loaders: [
        'babel',
        'eslint'
      ]
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.woff/,
      loader: 'url?prefix=font/&limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf/,
      loader: 'file?prefix=font/'
    }, {
      test: /\.eot/,
      loader: 'file?prefix=font/'
    }, {
      test: /\.svg/,
      loader: 'file?prefix=font/'
    }, {
      test: /\.html$/,
      loaders: [
        'html'
      ]
    }]
  },
  output: {
    //filename: ((build.prod) ? 'js/[name].[chunkhash].js' : 'js/[name].js'),
    filename: 'js/[name].js',
    path: dist
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', ((build.prod) ? 'js/vendors.[chunkhash].js' : 'js/vendors.js')),
    new HtmlWebpackPlugin({
      pkg: require('./package.json'),
      template: 'src/index.html',
      filename: 'index.html',
      inject: false
    })
  ],
  resolve: {
    alias: { // If the the key ends with $ only the exact match (without the $) will be replaced.
      'ionic$': 'ionic-sdk/release/js/ionic.js',
      'ionic-angular': 'ionic-sdk/release/js/ionic-angular.js'
    }
  }
};
