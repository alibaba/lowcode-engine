---
title: 参与贡献
sidebar_position: 0
---

### 环境准备

开发 LowcodeEngine 需要 Node.js 16+。

推荐使用 nvm 管理 Node.js，避免权限问题的同时，还能够随时切换当前使用的 Node.js 的版本。

### 贡献低代码引擎

#### clone 项目

```
git clone git@github.com:alibaba/lowcode-engine.git
cd lowcode-engine
```

#### 安装依赖并构建

```
npm install && npm run setup
```

#### 调试环境配置

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

#### 开发

```
npm start
```

选择一个环境进行调试，例如[低代码引擎在线 DEMO](https://lowcode-engine.cn/demo/demo-general/index.html)

开启代理之后，就可以进行开发调试了。


### 贡献低代码引擎文档

#### 开发文档

在 lowcode-engine 目录下执行下面命令
```
cd docs

npm start
```

#### 维护方式
- 官方文档通过 github 管理文档源，官网文档与[主仓库 develop 分支](https://github.com/alibaba/lowcode-engine/tree/develop/docs)保持同步。
- 点击每篇文档下发的 `编辑此页` 可直接定位到 github 中位置。
- 欢迎 PR，文档 PR 也会作为贡献者贡献，会用于贡献度统计。
- **文档同步到官方网站由官方人员进行操作**，如有需要可以通过 issue 或 贡献者群与相关人员沟通。
- 为了提供更好的阅读和使用体验，文档中的图片文件会定期转换成可信的 CDN 地址。

#### 文档格式

本项目文档参考[文档编写指南](https://github.com/sparanoid/chinese-copywriting-guidelines)。

使用 vscode 进行编辑的朋友可以安装 vscode 插件 [huacnlee.autocorrect](https://github.com/huacnlee/autocorrect) 辅助文档 lint。


### 贡献低代码引擎生态

相关源码详见[NPM 包对应源码位置汇总](/site/docs/guide/appendix/npms)

开发调试方式详见[低代码生态脚手架 & 调试机制](/site/docs/guide/expand/editor/cli)

### 发布

PR 被合并之后，我们会尽快发布相关的正式版本或者 beta 版本。

### 加入 Contributor 群
提交过 Bugfix 或 Feature 类 PR 的同学，如果有兴趣一起参与维护 LowcodeEngine，我们提供了一个核心贡献者交流群。

1. 可以通过[填写问卷](https://survey.taobao.com/apps/zhiliao/4YEtu9gHF)的方式，参与到其中。
2. 填写问卷后加微信号 `wxidvlalalalal` （注明 github id）我们会拉你到群里。

如果你不知道可以贡献什么，可以到源码里搜 TODO 或 FIXME 找找。

为了使你能够快速上手和熟悉贡献流程，我们这里有个列表 [good first issues](https://github.com/alibaba/lowcode-engine/issues?q=is:open+is:issue+label:%22good+first+issue%22)，里面有相对没那么笼统的漏洞，从这开始是个不错的选择。

### PR 提交注意事项

- lowcode-engine 仓库建议从 develop 创建分支，PR 指向 develop 分支。
- 其他仓库从 main 分支创建分支，PR 指向 main 分支
- 如果你修复了 bug 或者添加了代码，而这些内容需要测试，请添加测试！
- 确保通过测试套件（yarn test）。
- 请签订贡献者许可证协议（Contributor License Agreement）。
   > 如已签署 CLA 仍被提示需要签署，[解决办法](/site/docs/faq/faq021)