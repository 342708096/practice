
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var utils = require('./utils')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
var htmlPlugins = utils.collect(config.projectInfo.template).map(function (template) {
  return new HtmlWebpackPlugin({
    filename: template.filename,
    template: utils.resolvePath(template.filename),
    inject: true,
    chunks: template.chunks,
    chunksSortMode: 'manual'
  })
})
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: `${config.projectInfo.name}.html`,
    //   template: config.projectInfo.entryHtml,
    //   inject: true,
    //   chunks:['common', config.projectInfo.name],
    //   chunksSortMode: 'manual'
    // }),
    new FriendlyErrorsPlugin()
  ].concat(htmlPlugins)
})
