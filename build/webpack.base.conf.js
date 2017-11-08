var path = require('path')
var config = require('./config')
var vueLoaderConfig = require('./vue-loader.conf')
var utils = require('./utils')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var entry = {}

utils.collect(config.projectInfo.chunks).forEach(function(chunk) {
  entry[chunk.name] = utils.collect(chunk.entry).map(function(entry) {
    return utils.resolvePath(entry)
  })
})

module.exports = {
  entry: entry,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('common')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('projects')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // 只转码这两个目录, node_modules 不转码, 加快编码速度 😁
        include: [resolve('projects'), resolve('common')]
      },
      // {
      //   test: /\.tpl$/,
      //   loader: 'regexp-replace-loader',
      //   options: {
      //     match: {
      //       pattern: '__PATH__',
      //       flags: 'g'
      //     },
      //     replaceWith: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
      //   }
      // },
      {
        test: /\.tpl$/,
        loader: 'art-template-loader',
        options: {
          escape: false
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          attrs: [':data-src', ':src', 'link:href']
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[ext]?hash=[hash:7]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]?hash=[hash:7]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]?hash=[hash:7]')
        }
      }
    ]
  }
}
