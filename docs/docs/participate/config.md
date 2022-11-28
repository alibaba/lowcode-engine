---
title: 引擎的工程化配置
sidebar_position: 3
---
目前引擎体系共包含 3 个 js 文件，即：
```html
<!-- engine-core 引擎的 core，负责引擎的基础模块 -->
<script crossorigin="anonymous" src="//alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.0/dist/js/engine-core.js"></script>
<!-- engine-ext 引擎的扩展包，负责收拢内置 setters / plugins，方便迭代 -->
<script crossorigin="anonymous" src="//alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@1.0.1/dist/js/engine-ext.js"></script>
```

工程化配置我们进行了统一，具体如下：
```shell
{
  "entry": {
    ...
  },
  "library": "...",
  "libraryTarget": "umd",
  "externals": {
    "react": "var window.React",
    "react-dom": "var window.ReactDOM",
    "prop-types": "var window.PropTypes",
    "rax": "var window.Rax",
    "@alilc/lowcode-engine": "var window.AliLowCodeEngine",
    "@alilc/lowcode-engine-ext": "var window.AliLowCodeEngineExt",
    "moment": "var moment",
    "lodash": "var _",
    "@alifd/next": "var Next"
  },
  "polyfill": false,
  "outputDir": "dist",
  "vendor": false,
  "ignoreHtmlTemplate": true,
  "sourceMap": true,
  "plugins": [
    "build-plugin-react-app",
    ["build-plugin-fusion", {
    }],
    ["build-plugin-moment-locales", {
      "locales": ["zh-cn"]
    }],
    "./build.plugin.js"
  ]
}

```
总结一下，有 2 点：

1. **都不包含 polyfill，**需要应用级别单独引入 polyfill，推荐动态 polyfill
2. **都不包含 lodash / moment / next**


#### 前置依赖资源：
```html
<link rel="stylesheet" href="//alifd.alicdn.com/npm/@alifd/next/1.20.25/next.min.css">

<script src="//polyfill.alicdn.com/s/polyfill.min.js?features=default,es2017,es6,fetch,RegeneratorRuntime"></script>
<script src="//alifd.alicdn.com/npm/@alifd/next/1.20.25/next.min.js"></script>
<script src="//g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js"></script>
<script src="//g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js"></script>
```


#### 所有资源：
```html
<link rel="stylesheet" href="//alifd.alicdn.com/npm/@alifd/next/1.20.25/next.min.css">
<link rel="stylesheet" href="//alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.0/dist/css/engine-core.css"/>
<link rel="stylesheet" href="//alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@1.0.1/dist/css/engine-ext.css"/>

<script src="//polyfill.alicdn.com/s/polyfill.min.js?features=default,es2017,es6,fetch,RegeneratorRuntime"></script>
<script src="//alifd.alicdn.com/npm/@alifd/next/1.20.25/next.min.js"></script>
<script src="//g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js"></script>
<script src="//g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js"></script>
<!-- engine-core 引擎的 core，负责引擎的基础模块 -->
<script crossorigin="anonymous" src="//alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.0/dist/js/engine-core.js"></script>
<!-- engine-ext 引擎的扩展包，负责收拢内置 setters / plugins，方便迭代 -->
<script crossorigin="anonymous" src="//alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@1.0.1/dist/js/engine-ext.js"></script>
```
