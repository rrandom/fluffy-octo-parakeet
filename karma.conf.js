var path = require('path');
var webpack = require('webpack')

var webpackConfig = {
  resolve: {
    alias: {
      vue: path.resolve(__dirname, '../src/entries/web-runtime-with-compiler'),
      compiler: path.resolve(__dirname, '../src/compiler'),
      core: path.resolve(__dirname, '../src/core'),
      shared: path.resolve(__dirname, '../src/shared'),
      web: path.resolve(__dirname, '../src/platforms/web'),
      weex: path.resolve(__dirname, '../src/platforms/weex'),
      server: path.resolve(__dirname, '../src/server'),
      entries: path.resolve(__dirname, '../src/entries'),
      sfc: path.resolve(__dirname, '../src/sfc')
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  plugins: [new webpack.DefinePlugin({
    __WEEX__: false,
    'process.env': {
      NODE_ENV: '"development"',
      TRANSITION_DURATION: process.env.SAUCE ?
        500 :
        50,
      TRANSITION_BUFFER: process.env.SAUCE ?
        50 :
        10
    }
  })],
  devtool: '#inline-source-map'
}

// shared config for all unit tests
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['../test/unit/index.js'],
    preprocessors: {
      '../test/unit/index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }, 
    browsers: ['PhantomJS'],
    reporters: ['progress'],
  })
}