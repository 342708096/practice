# activity new
---
## 介绍
本项目参考了之前的activity项目结构,使用webpack2作为主要构建工具,支持生产环境和开发环境配置分离,支持多个子项目,支持多页面多入口,
,支持模板引擎(art-template/vue),支持后端代理,开发模式支持热更新和浏览器自动刷新,支持eslint语法检查,强大的配置文件使得开发和部署更加灵活,极大提高工作效率.

## 环境
1. nodeJS 安装一个新版本的nodejs,目前使用v8.x可以保证正常运行,如果是linux或者mac环境推荐使用[nvm](#https://github.com/creationix/nvm/blob/master/README.md)作为nodejs版本管理.
2. [nrm](#https://github.com/Pana/nrm)作为源管理工具,使用自己的私有源

	```
	npm i nrm -g
	nrm add newssdk http://10.0.68.202:4873/
	nrm use newssdk
	```
3. 安装环境

	```
	npm i
	```	
	
## 目录结构
```
activity-new/
├── build/								构建相关的配置文件
├── common/								公共资源库
	├── js/								一些公共js组件, SDK 埋点等公共方法
	├── scss/							公共scss
├── dist/								生产模式下打包生成的目录
	├── [project name]/					项目名称
		├── [version]/					版本
			├──css/						打包后的css文件
			├──images/					打包后的图片
			├──js/						打包后的js文件
			├──*.html					打包后的html
├── node_modules/						项目依赖包目录
├── projects/							项目源码目录
	├── [project name]/					子项目名称
		├──tpl/							模板目录
		├──scss/						scss目录
		├──images/						图片
		├──js/							js文件
		├──*.html						html
		├──package.json					子项目的打包配置
├── .babelrc							babel配置文件
├── .editorconfig						编辑器配置
├── .eslintrc.js						eslint配置文件
├── .eslintignore						eslint ignore文件
├── package.json						包描述文件
├── README.md							说明

```	

## 开发与构建
1. 开发模式`npm start -- --name [project name]`
	
	```
	npm start -- --name iphone8
	```
2. 生产环境打包`npm run build -- --name [project name]`

	```
	npm run build -- --name iphone8
	```
3. 部署到服务器(准线上环境) `npm run scp -- --name [project name]`

	```
	npm run scp -- --name iphone8
	```	
4. 部署到服务器(线上环境): 一般情况下由jenkins完成

	先设置环境变量online为true `export online=true` 然后同上`npm run scp -- --name [project name]`
	
## 子项目配置
子项目的开发打包都需要依赖子项目目录下package.json来读取相应的webpack配置.它的结构可以参考iphone8子项目内的package.json

**相对引用**: 可以引用自身的某个属性 例如 `{name}` `{version}`

**相对路径**: 可以使用`@`符号来指定根目录路径否则就是子项目路径 例如 `@common/js/components/index.js`

### name [string]
项目名称, 无需配置 由打包参数 --name [project name] 来指定

### version [string]
子项目的版本 例如 `1.0`

### chunks [array/object]
需要拆分多少代码块,可以是单个或者多个, 它由name和entry组成

**name[string]**: 最后打包后的名称

**entry[string/array]**: 代码依赖的入口,webpack根据entry来查找依赖进行打包,路径参考**相对路径**介绍,如果是数组那么将打包成一个chunk

可以灵活的自定义chunk的多少,如果子项目就是一个html和一个js入口,那么定义一个chunk比较简单
例如

```
  "chunks": 
    {
      "name": "{name}",
      "entry": "js/{name}.js"
    },
    
    // {name} 表示子项目名称,请参考相对引用
```
如果是多个html对应多个js入口, 划分多个chunk有个好处就是公共代码可以很好的复用:

```
  "chunks": [
    {
      "name": "common",
      "entry": ["@common/js/components/index.js", "@common/js/libs/jsKit.js"]
    },
    {
      "name": "{name}",
      "entry":"js/{name}.js"
    },
    {
      "name": "aaa",
      "entry":"js/aaa.js"
    }
  ],
```
chunk可以定义css入口: 

```
  "chunks": [
    ...
    {
      "name": "css",
      "entry":"scss/iphone8.scss"
    },
    {
      "name": "ress",
      "entry":"@node_modules/ress"
    }
  ],
```

### template [array/object]
html模板配置(当然也可以是别的模板`.ejs`)

```
 "template": [
    {
      "filename": "aaa.html",
      "chunks": ["common", "aaa", "css"],
      "autoOpenBrowser": true
    },
    {
      "filename": "index.html",
      "chunks": ["ress", "css", "common", "{name}"],
      "autoOpenBrowser": "?openType=0&newsId=225790677&openIdShare=NjI5NjAzNTcyMDgxNzk3OTQ0Mw%3D%3D&from=groupmessage&isappinstalled=0"
    }
  ],
```

**filename [string]**: 模板名称,请确保在子项目根目录内

**chunks [array/string]**: 关联的chunk名称,请填写上面配置的chunk name

**autoOpenBrowser [boolean/string]**: 在开发模式下是否自动打开浏览器,有三种配置方式

	"autoOpenBrowser": true    // 将会自动打开浏览器到当前模板
	"autoOpenBrowser": "?a=1&b=2" // 自动打开浏览器到当前模板并携带参数
	"autoOpenBrowser": "http://3g.k.sohu.com/..." // 自动打开浏览器到此网址, 适合配了代理的情况

	不配置或者为false则不会自动打开浏览器

### publicPath [string]

开发模式下资源的相对路径

```
  "publicPath": "/h5apps/{name}/modules/{name}/",
```

### CDN [string]

生产环境下静态资源的CDN路径, 开发时引用图片等静态资源只需要写相对路径即可, 生产模式会自动替换成CDN路径

```
"CDN": "//k.sohu.com/static/{name}/{version}/",
```

### proxy [object]

配置后端接口代理,为了避免跨域

```
  "proxy": {
    "api": {                // 这个名字可以随意起
      "filter": "/api",
      "target": "http://onlinetestapi.k.sohu.com",
      "changeOrigin": true
    }
  },
  
  // 这将把 http://onlinetestapi.k.sohu.com/api/** 代理到 localhost:8080/api/**
```

### scp [object]
一般情况下不建议修改

**onlinetest**: scp 准线上的部署地址

```
 "onlinetest": {
      "host": "10.10.94.63",
      "username": "h5apps",
      "password": "PO#Ye*e32",
      "path": "/opt2{publicPath}"
    }
```

**online**: scp的线上部署地址

```
"online": [
      {
        "host": "10.13.89.130",
        "username": "h5apps",
        "password": "PO#Ye*e32",
        "path": "/home{publicPath}"
      },
      {
        "host": "10.13.89.131",
        "username": "h5apps",
        "password": "PO#Ye*e32",
        "path": "/home{publicPath}"
      }
    ]
```
