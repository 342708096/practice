var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer')
var entryPath = require('./config').projectInfo.entryPath
exports.assetsPath = function (_path) {
  // var assetsSubDirectory = process.env.NODE_ENV === 'production'
  //   ? config.build.assetsSubDirectory
  //   : config.dev.assetsSubDirectory;
  return path.posix.join( _path)
};
exports.cssLoaders = function (options) {
  options = options || {};

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  };
  var postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
      plugins: () => [
        autoprefixer({
          browsers: [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 35',
            //'Firefox >= 31',
            //'Explorer >= 9',
            'iOS >= 7',
            //'Opera >= 12',
            'Safari >= 7.1'
          ]
        })
      ]
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader, postcssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = [];
  var loaders = exports.cssLoaders(options);
  for (var extension in loaders) {
    var loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
};
function isArray(o){
  return Object.prototype.toString.call(o) === '[object Array]'
}
exports.isArray = isArray

exports.resolvePath = function resolve (dir) {
  var reg = /^@([\w]+)\//
  var match = reg.exec(dir)
  if (match) {
    return path.resolve(__dirname, '..', match[1], dir.replace(reg, ''))
  }
  return path.join(entryPath, dir)
}

exports.collect = function (obj) {
  if (isArray(obj)) {
    return [].concat(obj)
  } else if (obj) {
    return [obj]
  } else {
    return []
  }
}
