---
title: 调试环境配置
sidebar_position: 1
---
低代码引擎的核心仓库是不包含任何物料、插件、setter 的，它本身用于生成低代码引擎的主包。

如果您需要对低代码的主包进行开发和调试，需要用到本文里介绍的知识。

如果您需要对低代码编辑器进行定制，您可能只需要 clone [lowcode-demo 项目](https://github.com/alibaba/lowcode-demo)并进行修改，参考“[配置低代码扩展点](/site/docs/guide/expand/editor/summary)”章节。

> 前置条件：
> node 推荐使用 16.18.0（14.x 也可以）

### 1. 拉取代码，启动项目
```bash
git clone git@github.com:alibaba/lowcode-engine.git
cd lowcode-engine
npm install && npm run setup
npm start


git clone git@github.com:alibaba/lowcode-demo.git
cd lowcode-demo
npm install && npm start
```

### 2. 配置资源代理
本质上是将 demo 页面引入的几个 js/css 代理到 engine 项目，可以使用趁手的代理工具，这里推荐 [XSwitch](https://chrome.google.com/webstore/detail/xswitch/idkjhjggpffolpidfkikidcokdkdaogg?hl=en-US)。

本地开发代理规则如下：
```json
{
  "proxy": [
    [
      "https://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/(.*)/dist/js/engine-core.js",
      "http://localhost:5555/js/AliLowCodeEngine.js"
    ],
    [
      "https://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/(.*)/dist/css/engine-core.css",
      "http://localhost:5555/css/AliLowCodeEngine.css"
    ],
    [
      "https?://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/(.*)/dist/js/react-simulator-renderer.js",
      "http://localhost:5555/js/ReactSimulatorRenderer.js"
    ],
    [
      "https?://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/(.*)/dist/css/react-simulator-renderer.css",
      "http://localhost:5555/css/ReactSimulatorRenderer.css"
    ],
    [
      "https?://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/(.*)/dist/js/rax-simulator-renderer.js",
      "http://localhost:5555/js/RaxSimulatorRenderer.js"
    ],
    [
      "https?://uipaas-assets.com/prod/npm/@alilc/lowcode-engine/(.*)/dist/css/rax-simulator-renderer.css",
      "http://localhost:5555/css/RaxSimulatorRenderer.css"
    ],
  ]
}
```

### 3. 本地调试物料/插件/设置器

详见[低代码生态脚手架 & 调试机制](/site/docs/guide/expand/editor/cli)
