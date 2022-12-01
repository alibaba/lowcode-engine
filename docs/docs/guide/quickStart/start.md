---
sidebar_position: 2
title: 快速开始
---
# 前置知识
我们假定你已经对 HTML 和 JavaScript 都比较熟悉了。即便你之前使用其他编程语言，你也可以跟上这篇教程的。除此之外，我们假定你也已经熟悉了一些编程的概念，例如，函数、对象、数组，以及 class 的一些内容。<br />如果你想回顾一下 JavaScript，你可以阅读[这篇教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。注意，我们也用到了一些 ES6（较新的 JavaScript 版本）的特性。在这篇教程里，我们主要使用了[箭头函数（arrow functions）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)、[class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)、[let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 语句和 [const](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 语句。你可以使用 [Babel REPL](https://babeljs.io/repl/#?presets=react&code_lz=MYewdgzgLgBApgGzgWzmWBeGAeAFgRgD4AJRBEAGhgHcQAnBAEwEJsB6AwgbgChRJY_KAEMAlmDh0YWRiGABXVOgB0AczhQAokiVQAQgE8AkowAUAcjogQUcwEpeAJTjDgUACIB5ALLK6aRklTRBQ0KCohMQk6Bx4gA) 在线预览 ES6 的编译结果。

# 环境准备
## WSL（Window 电脑）
Window 环境需要使用 WSL 在 windows 下进行低代码引擎相关的开发。安装教程 ➡️ [WSL 安装教程](https://docs.microsoft.com/zh-cn/windows/wsl/install)。<br />**对于 Window 环境来说，之后所有需要执行命令的操作都是在 WSL 终端执行的。**
## Node
node 版本推荐 14.17.0。

### 查看 Node 版本
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660653856191-128d8e3f-9636-4b73-94ab-c03cf6965365.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=35&id=u44a9af04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=70&originWidth=238&originalType=binary&ratio=1&rotation=0&showTitle=false&size=11948&status=done&style=none&taskId=udb616117-a27c-409d-9e1c-1b89931a714&title=&width=119)

### 变更 node 版本
可以安装 [n](https://www.npmjs.com/package/n) 来管理和变更 node 版本。

#### 安装
```json
npm install -g n
```

#### 变更 node 版本
```json
n 14.17.0
```

## React
低代码引擎的扩展能力都是基于 React 来研发的，在继续阅读之前最好有一定的 React 基础，React 学习教程 ➡️ [React 快速开始教程](https://zh-hans.reactjs.org/docs/getting-started.html)。

## 下载 Demo
可以前往 github（https://github.com/alibaba/lowcode-demo）将 DEMO 下载到本地。

### git clone
#### HTTPS
需要使用到 git 工具
```json
git clone https://github.com/alibaba/lowcode-demo.git
```
#### SSH
需要配置 SSH key，如果没有配置可以
```json
git clone git@github.com:alibaba/lowcode-demo.git
```

### 下载 Zip 包
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660653725650-ab734ba4-64a7-4801-9d2f-5c496879054f.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=897&id=uc1b07458&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1794&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1306258&status=done&style=stroke&taskId=ubaa4eb12-0e87-464e-b3da-306ed9685b7&title=&width=1792)

## 安装依赖
在  lowcode-demo 目录下执行：
```json
npm install
```

## 启动 demo
在 lowcode-demo 目录下执行：
```json
npm run start
```

之后就可以通过 [http://localhost:5556/](http://localhost:5556/) 来访问我们的 DEMO 了。
# 认识 Demo
我们的 Demo 是一个**低代码平台的设计器**。它是一个低代码平台中最重要的一环，用户可以在这里通过拖拽、配置、写代码等等来完成一个页面的开发。由于用户的人群不同、场景不同、诉求不同等等，这个页面的功能就会有所差异。<br />这里记住**设计器**这个词，它描述的就是下面的这个页面，后面我们会经常看到它。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660654189055-45fd0c7e-75cb-4072-a4d4-7cf244405c7d.png#clientId=ubcf63daf-5747-4&crop=0&crop=0.008&crop=1&crop=1&from=paste&height=904&id=LBi2j&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1808&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=763122&status=done&style=stroke&taskId=u82753ad5-3b5d-43b2-b309-a99c2a7bb24&title=&width=1792)

## 场景介绍
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660654738730-490fc94a-8b42-4c48-b21e-4c0694416b07.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=903&id=ub700edc2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1806&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=802013&status=done&style=stroke&taskId=u317bff98-636d-402a-98f2-f9e0b08293b&title=&width=1792)

Demo 根据**不同的设计器所需要的物料不同**，分为了下面的 8 个场景：

- 综合场景
- 基础 fusion 组件
- 基础 fusion 组件 + 单自定义组件
- 基础 antd 组件
- 自定义初始化引擎
- 扩展节点操作项
- 基于next实现的高级表单低代码物料
- antd 高级组件 + formily 表单组件

可以点开不同的场景，看看他们使用的物料。

## 目录介绍
仓库下的 src/scenarios 目录就对应刚刚介绍的场景。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660655237007-fddd8534-d4ed-4a25-ba2f-f335f8ac3c36.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=348&id=ubf68019d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=696&originWidth=696&originalType=binary&ratio=1&rotation=0&showTitle=false&size=148777&status=done&style=stroke&taskId=u68648c51-7648-494e-bd41-4f29fb144f9&title=&width=348)

不同场景的目录结构实际上都是类似的，这里我们主要介绍一下综合场景的目录结构即可。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660655399364-b40d206a-977d-4000-9be1-681823f8a995.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1010&id=ub727a7fa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1373541&status=done&style=stroke&taskId=ue55dc86f-375d-4c7f-a63f-d5208683035&title=&width=1792)<br />综合场景目录下只有一个文件，这个文件做了几个事情：

- 通过 plugins.register 注册「切换场景」的插件，也就是上面介绍的切换场景的功能。
- 通过 registerPlugins 注册更多的插件：
   - ManualPlugin：增加弹出「低代码产品使用文档」按钮
   - Inject：支持调试功能
   - registerRefProp：支持给每个组件注入 ref
   - ...
- 通过 init 初始化低代码设计器

做了这些事情之后，我们的低代码设计器就已经有了基本的能力了。也就是最开始我们看到的这样。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660654189055-45fd0c7e-75cb-4072-a4d4-7cf244405c7d.png#clientId=ubcf63daf-5747-4&crop=0&crop=0.008&crop=1&crop=1&from=paste&height=904&id=MZdfk&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1808&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=763122&status=done&style=stroke&taskId=u82753ad5-3b5d-43b2-b309-a99c2a7bb24&title=&width=1792)

接下来我们就根据我们自己的诉求通过对设计器进行扩展，改动成我们需要的设计器功能。
# 开发一个插件
## 方式1：在 DEMO 中直接新增插件
![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660656064139-8da57c37-7e0b-4e8d-9f2d-8ea86d5af134.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=280&id=uc7f75c37&margin=%5Bobject%20Object%5D&name=image.png&originHeight=560&originWidth=820&originalType=binary&ratio=1&rotation=0&showTitle=false&size=125690&status=done&style=stroke&taskId=u53c07118-a2ca-4a77-a27f-3b2b20085ac&title=&width=410)

可以在 demo/sample-plugins 直接新增插件，这里我新增的插件目录是 plugin-demo。并且新增了 index.tsx 文件，将下面的代码粘贴到 index.tsx 中。
```javascript
import * as React from 'react';
import { ILowCodePluginContext } from '@alilc/lowcode-engine';

const LowcodePluginPluginDemo = (ctx: ILowCodePluginContext) => {
  return {
    // 插件对外暴露的数据和方法
    exports() {
      return {
        data: '你可以把插件的数据这样对外暴露',
        func: () => {
          console.log('方法也是一样');
        },
      }
    },
    // 插件的初始化函数，在引擎初始化之后会立刻调用
    init() {
      // 你可以拿到其他插件暴露的方法和属性
      // const { data, func } = ctx.plugins.pluginA;
      // func();

      // console.log(options.name);

      // 往引擎增加面板
      ctx.skeleton.add({
        area: 'leftArea',
        name: 'LowcodePluginPluginDemoPane',
        type: 'PanelDock',
        props: {
          description: 'Demo',
        },
        content: <div>这是一个 Demo 面板</div>,
      });

      ctx.logger.log('打个日志');
    },
  };
};

// 插件名，注册环境下唯一
LowcodePluginPluginDemo.pluginName = 'LowcodePluginPluginDemo';
LowcodePluginPluginDemo.meta = {
  // 依赖的插件（插件名数组）
  dependencies: [],
  engines: {
    lowcodeEngine: '^1.0.0', // 插件需要配合 ^1.0.0 的引擎才可运行
  },
}

export default LowcodePluginPluginDemo;
```

在 src/scenarios/index/index.ts 中新增下面代码<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660656497051-49e08633-2d78-428c-becc-c282905cdb90.png#clientId=ubcf63daf-5747-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1010&id=u426edc7b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1458910&status=done&style=stroke&taskId=uf1e42399-caf7-4d82-a797-698fa730486&title=&width=1792)

这样在我们的设计器中就新增了一个 Demo 面板。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660656566260-86dfed37-60d0-45ca-967e-5df8ea7a34d0.png#clientId=ubcf63daf-5747-4&crop=0&crop=0.0053&crop=1&crop=1&from=paste&height=903&id=u17565cd3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1806&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=734227&status=done&style=stroke&taskId=u5dbe00f3-447b-451e-ac48-9b02281afc3&title=&width=1792)
## 方式2：在新的仓库下开发插件
初始化
```json
npm init @alilc/element your-plugin-name
```

选择设计器插件（plugin）<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660702297326-ccfe60f9-ee22-4a24-a293-26351d107663.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=107&id=ub2bf5248&margin=%5Bobject%20Object%5D&name=image.png&originHeight=214&originWidth=730&originalType=binary&ratio=1&rotation=0&showTitle=false&size=82091&status=done&style=stroke&taskId=u82628265-73f0-4d57-b4ba-1b18600a1f0&title=&width=365)

根据操作完善信息<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660702439529-867a893f-f27a-4e48-8a5a-ee45aa97e355.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=109&id=uc9b09fec&margin=%5Bobject%20Object%5D&name=image.png&originHeight=218&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&size=102705&status=done&style=stroke&taskId=ue4a95f21-43d3-4da8-9c0e-b21dfe239bf&title=&width=433)

插件项目就初始化完成了<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660702464438-3d7e07eb-53c7-417c-9e6d-06fdf9acfb86.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=280&id=u0ee65b4e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1197702&status=done&style=stroke&taskId=u5f9fdae3-1adc-4b02-969c-5c43c3d4c9c&title=&width=496)

在插件项目下安装依赖
```json
npm install
```

启动项目
```json
npm run start
```

调试项目<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660705712773-f2446689-2b5f-42e7-9e85-30857270dfbb.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=346&id=u448649c5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1936&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=757713&status=done&style=stroke&taskId=u0b617456-826e-4993-951e-303da417172&title=&width=641)

在 Demo 中调试项目<br />在 build.json 下面新增 "inject": true，就可以在 [https://lowcode-engine.cn/demo/index.html?debug](https://lowcode-engine.cn/demo/index.html?debug) 页面下进行调试了。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660705860117-5a11a5fa-9215-4b94-84b7-497899cafe10.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1010&id=u3a36c42f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=887101&status=done&style=stroke&taskId=u747bc337-5212-4a8b-a88f-127c53ea621&title=&width=1792)
# 开发一个自定义物料
## 初始化物料
```json
npm init @alilc/element your-material-demo
```
选择组件/物料栏<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660706045985-db73ca55-925a-446b-ace4-b59fa1e18469.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=104&id=kuWIf&margin=%5Bobject%20Object%5D&name=image.png&originHeight=208&originWidth=824&originalType=binary&ratio=1&rotation=0&showTitle=false&size=88910&status=done&style=stroke&taskId=u92f5fa65-386a-4f52-a093-bcbbebdc2d7&title=&width=412)

配置其他信息<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660706116845-9b3b938f-c132-426b-81bd-d49283ebf9e8.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=124&id=u941c9808&margin=%5Bobject%20Object%5D&name=image.png&originHeight=248&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&size=111864&status=done&style=stroke&taskId=ue4ff4dab-3a53-4811-bf70-7fa6fc0c8b6&title=&width=400)

这样我们就初始化好了一个 React 物料。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660706173968-3e5db25a-e08d-4852-90c9-ffaa0968fd62.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1010&id=u854b37cc&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1080400&status=done&style=stroke&taskId=u10e21350-23d4-4d8f-8c16-0c5a221fc2e&title=&width=1792)
## 启动并调试物料
### 安装依赖
```json
npm i
```
### 启动
```json
npm run lowcode:dev
```

我们就可以通过 [http://localhost:3333/](http://localhost:3333/) 看到我们的研发的物料了。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660706484894-73798e35-1e58-4ffe-bb3c-bfba7b014433.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=895&id=zVMiy&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1790&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=678753&status=done&style=stroke&taskId=u241f50c0-1a43-4854-8443-7e972f15623&title=&width=1792)
### 在 Demo 中调试
```json
npm i @alilc/build-plugin-alt
```

修改 build.lowcode.js<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660706733149-0170b2fb-88de-40e3-8204-f510d7e42f77.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=311&id=u8a1a8bea&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1046&originWidth=1388&originalType=binary&ratio=1&rotation=0&showTitle=false&size=291155&status=done&style=stroke&taskId=u61ede7d2-f92d-43b9-8582-a2362a9ea14&title=&width=413)

如图，新增如下代码
```json
[
  '@alilc/build-plugin-alt',
  {
    type: 'component',
    inject: true,
    library,
    // 配置要打开的页面，在注入调试模式下，不配置此项的话不会打开浏览器
    // 支持直接使用官方 demo 项目：https://lowcode-engine.cn/demo/index.html
    openUrl: 'https://lowcode-engine.cn/demo/index.html?debug',
  },
],
```

我们重新启动项目，就可以在 Demo 中找到我们的自定义组件。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660706823666-ca28a08d-6241-4112-bc78-b9078c81fb75.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=906&id=u31bdc31a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1812&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=788013&status=done&style=stroke&taskId=uaa4789a2-452f-4b04-8894-759989e4568&title=&width=1792)

## 发布
首先进行构建
```json
npm run lowcode:build
```

发布组件
```json
npm publish
```

这里我发布的组件是 [my-material-demo](https://www.npmjs.com/package/my-material-demo)。在发布之后我们就会有两个重要的文件：

- 低代码描述：[https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js](https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js)
- 组件代码：[https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.js](https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.js)

我们也可以从 [https://unpkg.com/my-material-demo@0.1.0/build/lowcode/assets-prod.json](https://unpkg.com/my-material-demo@0.1.0/build/lowcode/assets-prod.json) 找到我们的资产包描述。
```json
{
  "packages": [
    {
      "package": "my-material-demo",
      "version": "0.1.0",
      "library": "BizComp",
      "urls": [
        "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.js",
        "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.css"
      ],
      "editUrls": [
        "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/view.js",
        "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/view.css"
      ],
      "advancedUrls": {
        "default": [
          "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.js",
          "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.css"
        ]
      },
      "advancedEditUrls": {}
    }
  ],
  "components": [
    {
      "exportName": "MyMaterialDemoMeta",
      "npm": {
        "package": "my-material-demo",
        "version": "0.1.0"
      },
      "url": "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js",
      "urls": {
        "default": "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js"
      },
      "advancedUrls": {
        "default": [
          "https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js"
        ]
      }
    }
  ],
}
```

## 使用
我们将刚刚发布的组件的 assets-prod.json 的内容放到 demo 的 src/universal/assets.json 中。<br />*最好放到最后，防止因为资源加载顺序问题导致出现报错。<br />如图，新增 packages 配置<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660707789785-ea75a399-6845-45a8-8c53-08402749c9a8.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1010&id=uf0f75c17&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1327766&status=done&style=stroke&taskId=ub053d846-69fd-4a55-8e9e-b41d1e06e47&title=&width=1792)<br />如图，新增 components 配置<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/2622706/1660707811725-a0e36f48-910d-45b5-b162-3aa4e2f87e9b.png#clientId=udb19495f-ea47-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1010&id=uf8c9506f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2020&originWidth=3584&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1222080&status=done&style=stroke&taskId=u10147f1f-27ed-4cec-bfc9-2cb3d61d6a2&title=&width=1792)

这时候再启动 DEMO 项目，就会有新的低代码物料了。接下来就按照你们的需求，继续扩展物料吧。
# 总结
这里只是简单的介绍了一些低代码引擎的基础能力，带大家简单的对低代码 DEMO 进行扩展，定制一些新的功能。低代码引擎的能力还有很多很多，可以继续去探索更多的功能。
