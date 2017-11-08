// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var minimist = require('minimist')
var chalk = require('chalk')

var projectInfo = (function () {
// 获取项目名称参数
  var argv = minimist(process.argv.slice(2));
  var name = argv.name; // 项目名称
  // let other = argv._;

  // 检查项目是否存在
  if (!name) {
    throw new Error(`请输入 -- --name={项目名}`)
  }

  var pkg = require(`../projects/${name}/package.json`)
  pkg.name = name
  function parse(str, source) {
    if (typeof str === 'string') {
      return str.replace(/{([$A-Za-z0-9_.]+)}/g, function($1, $2) {
        var properties = $2.split('.')
        properties = properties.map((p) => `[${JSON.stringify(p)}]`)
        return parse(eval('source' + properties.join('')), source)
      })
    } else if (typeof str === 'object') {
      for (var i in str) {
        if (str.hasOwnProperty(i)) {
          str[i] = parse(str[i], source)
        }
      }
    }
    return str
  }
  parse(pkg, pkg)
  pkg.entryPath = path.resolve(__dirname, '..', `projects/${name}/`)
  pkg.outputPath = path.resolve(__dirname, '..', `dist/${name}/${pkg.version}`)
  console.log(chalk.green('>  [Project Info]  ->  \n'))
  console.log(JSON.stringify(pkg, null, 2) + '\n')
  return pkg
})()


module.exports = {
  build: {
    env: {
      NODE_ENV: '"production"'
    },
    assetsRoot: projectInfo.outputPath,
    // assetsSubDirectory: '',
    assetsPublicPath: projectInfo.CDN,
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    port: process.env.devPort || 8080,
    // assetsSubDirectory: '',
    assetsPublicPath: projectInfo.publicPath || '/',
    proxyTable: projectInfo.proxy || {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true
  },
  projectInfo: projectInfo
}

