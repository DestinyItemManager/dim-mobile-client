/* eslint-env node */
var webpack = require('webpack');
// var path = require('path');
// var argv = require('yargs').argv;

var rootDir = __dirname;
var srcDir = rootDir + '/app/modules';
var distDir = rootDir + '/www/js';

module.exports = {
  // cache: true,
  // debug: true,
  context: rootDir,
  devTool: 'inline-source-map',
  // watch: true,
  eslint: {
    configFile: rootDir + '/.eslintrc'
  },
  entry: {
    bundle: srcDir + '/app.js',
    vendors: ['angular', 'lodash']
  },
  output: {
    path: distDir,
    filename: '/[name].js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: [
        'style',
        'css'
      ]
    }, {
      test: /\.html$/,
      loaders: [
        'html'
      ]
    }, {
      test: /\.js$/,
      exclude: [/app\/lib/, /node_modules/],
      loaders: [
        'babel',
        'ng-annotate',
        'eslint'
      ]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', '/vendors.js')
  ]
};
