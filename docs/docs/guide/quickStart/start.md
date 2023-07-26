---
sidebar_position: 2
title: 快速开始
---

## 前置知识

我们假定你已经对 HTML 和 JavaScript 都比较熟悉了。即便你之前使用其他编程语言，你也可以跟上这篇教程的。除此之外，我们假定你也已经熟悉了一些编程的概念，例如，函数、对象、数组，以及 class 的一些内容。

如果你想回顾一下 JavaScript，你可以阅读[这篇教程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。注意，我们也用到了一些 ES6（较新的 JavaScript 版本）的特性。在这篇教程里，我们主要使用了[箭头函数（arrow functions）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)、[class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)、[let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 语句和 [const](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const) 语句。你可以使用 [Babel REPL](https://babeljs.io/repl/#?presets=react&code_lz=MYewdgzgLgBApgGzgWzmWBeGAeAFgRgD4AJRBEAGhgHcQAnBAEwEJsB6AwgbgChRJY_KAEMAlmDh0YWRiGABXVOgB0AczhQAokiVQAQgE8AkowAUAcjogQUcwEpeAJTjDgUACIB5ALLK6aRklTRBQ0KCohMQk6Bx4gA) 在线预览 ES6 的编译结果。

## 环境准备

### WSL（Windows 电脑）

Window 环境需要使用 WSL 在 windows 下进行低代码引擎相关的开发。安装教程 ➡️ [WSL 安装教程](https://docs.microsoft.com/zh-cn/windows/wsl/install)。<br />**对于 Window 环境来说，之后所有需要执行命令的操作都是在 WSL 终端执行的。**

### Node

node 版本推荐 16.18.0。

#### 查看 Node 版本

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01oCZKNz290LIu8YUTk_!!6000000008005-2-tps-238-70.png)

#### 通过 n 来管理 node 版本

可以安装 [n](https://www.npmjs.com/package/n) 来管理和变更 node 版本。

##### 安装 n

```bash
npm install -g n
```

##### 变更 node 版本

```bash
n 14.17.0
```

### React

低代码引擎的扩展能力都是基于 React 来研发的，在继续阅读之前最好有一定的 React 基础，React 学习教程 ➡️ [React 快速开始教程](https://zh-hans.reactjs.org/docs/getting-started.html)。

### 下载 Demo

可以前往 github（<https://github.com/alibaba/lowcode-demo>）将 DEMO 下载到本地。

#### git clone

##### HTTPS

需要使用到 git 工具

```bash
git clone https://github.com/alibaba/lowcode-demo.git
```

##### SSH

需要配置 SSH key，如果没有配置可以

```bash
git clone git@github.com:alibaba/lowcode-demo.git
```

#### 下载 Zip 包

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01iYC7E11phaNwLFUrN_!!6000000005392-2-tps-3584-1794.png)

### 选择一个 demo 项目

在 以 `demo-general` 为例：

```bash
cd demo-general
```

### 安装依赖

在 `lowcode-demo/demo-general` 目录下执行：

```bash
npm install
```

### 启动 demo

在 `lowcode-demo/demo-general` 目录下执行：

```bash
npm run start
```

之后就可以通过 [http://localhost:5556/](http://localhost:5556/) 来访问我们的 DEMO 了。

## 认识 Demo

我们的 Demo 是一个**低代码平台的设计器**。它是一个低代码平台中最重要的一环，用户可以在这里通过拖拽、配置、写代码等等来完成一个页面的开发。由于用户的人群不同、场景不同、诉求不同等等，这个页面的功能就会有所差异。

这里记住**设计器**这个词，它描述的就是下面的这个页面，后面我们会经常看到它。
![image.png](https://img.alicdn.com/imgextra/i1/O1CN014nYXgF20pKrQIG2zV_!!6000000006898-2-tps-3584-1808.png)

### 场景介绍

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01nnP60l1dqUhUiNSx6_!!6000000003787-2-tps-2852-1156.png)

Demo 根据**不同的设计器所需要的物料不同**，分为了下面的 8 个场景：

- 综合场景
- 基础 fusion 组件
- 基础 fusion 组件 + 单自定义组件
- 基础 antd 组件
- 自定义初始化引擎
- 扩展节点操作项
- 基于 next 实现的高级表单低代码物料
- antd 高级组件 + formily 表单组件

可以点开不同的场景，看看他们使用的物料。
![](https://img.alicdn.com/imgextra/i1/O1CN01EU2jRN1wUwlal17WK_!!6000000006312-2-tps-3110-1974.png)

### 目录介绍

仓库下每个 demo-xxx-xxx 目录都是一个可独立运行的 demo 工程，分别对应到刚刚介绍的场景。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01ztxv5Y1mJozBsLdni_!!6000000004934-2-tps-696-958.png)

不同场景的目录结构实际上都是类似的，这里我们主要介绍一下综合场景的目录结构即可。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01A50oW522S5zg2eDUH_!!6000000007118-2-tps-732-1384.png)

介绍下其中主要的内容

- 设计器入口文件 `src/index.ts` 这个文件做了下述几个事情：
  - 通过 plugins.register 注册各种插件，包括官方插件 (已发布 npm 包形式的插件) 和 `plugins` 目录下内置的示例插件
  - 通过 init 初始化低代码设计器
- plugins 目录，存放的都是示例插件，方便用户从中看到一个插件是如何实现的
- services 目录，模拟数据请求、提供默认 schema、默认资产包等，此目录下内容在真实项目中应替换成真实的与服务端交互的服务。
- 预览页面入口文件 `preview.tsx`

剩下的各位看官可以通过源码来进一步了解。

做了这些事情之后，我们的低代码设计器就已经有了基本的能力了。也就是最开始我们看到的这样。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01YJVcOd1PiL1am6bz2_!!6000000001874-2-tps-3248-1970.png)

接下来我们就根据我们自己的诉求通过对设计器进行扩展，改动成我们需要的设计器功能。

## 开发一个插件

### 方式 1：在 DEMO 中直接新增插件

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01pXpSRs1QvRyut2EE3_!!6000000002038-2-tps-718-1144.png)

可以在 demo/sample-plugins 直接新增插件，这里我新增的插件目录是 plugin-demo。并且新增了 index.tsx 文件，将下面的代码粘贴到 index.tsx 中。

```javascript
import * as React from 'react';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const LowcodePluginPluginDemo = (ctx: IPublicModelPluginContext) => {
  return {
    // 插件对外暴露的数据和方法
    exports() {
      return {
        data: '你可以把插件的数据这样对外暴露',
        func: () => {
          console.log('方法也是一样');
        },
      };
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
};

export default LowcodePluginPluginDemo;
```

在 src/index.ts 中新增下面代码

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01pNTr4N1kldoYZRzgI_!!6000000004724-2-tps-1976-1250.png)

这样在我们的设计器中就新增了一个 Demo 面板。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01wtPIOV1TQiFLz5Vkf_!!6000000002377-2-tps-3584-1806.png)

### 方式 2：在新的仓库下开发插件

初始化

```bash
npm init @alilc/element your-plugin-name
```

选择设计器插件（plugin）

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01sA6sYW1tijqVeQCuq_!!6000000005936-2-tps-730-214.png)

根据操作完善信息

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01BzM1Jb1RcxbiJ0tJi_!!6000000002133-2-tps-866-218.png)

插件项目就初始化完成了

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01iVIAXD1XVWsOdKttI_!!6000000002929-2-tps-3584-2020.png)

在插件项目下安装依赖

```bash
npm install
```

启动项目

```bash
npm run start
```

调试项目

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01A4vPqC1xbeAqNxBRM_!!6000000006462-2-tps-3584-1936.png)

在 Demo 中调试项目

在 build.json 下面新增 "inject": true，就可以在 [https://lowcode-engine.cn/demo/demo-general/index.html?debug](https://lowcode-engine.cn/demo/demo-general/index.html?debug) 页面下进行调试了。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01uqSmrX1oqupxeGH1m_!!6000000005277-2-tps-3584-2020.png)

## 开发一个自定义物料

### 初始化物料

```bash
npm init @alilc/element your-material-demo
```

选择组件/物料栏

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01qVJQvG1Yhj2PJhhvk_!!6000000003091-2-tps-824-208.png)

配置其他信息

![image.png](https://img.alicdn.com/imgextra/i3/O1CN017fFT8O1IVmrLYg87F_!!6000000000899-2-tps-800-248.png)

这样我们就初始化好了一个 React 物料。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01SU2xn91TZPlzcARVI_!!6000000002396-2-tps-3584-2020.png)

### 启动并调试物料

#### 安装依赖

```bash
npm i
```

#### 启动

```bash
npm run lowcode:dev
```

我们就可以通过 [http://localhost:3333/](http://localhost:3333/) 看到我们的研发的物料了。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01JqoHqc1z7zlSWFYJD_!!6000000006668-2-tps-3584-1790.png)

#### 在 Demo 中调试

```bash
npm i @alilc/build-plugin-alt
```

修改 build.lowcode.js

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01K7u7ci1KCfYlBj2yf_!!6000000001128-2-tps-1388-1046.png)

如图，新增如下代码

```javascript
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

我们重新启动项目，就可以在 Demo 中找到我们的自定义组件。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN0166WywE26Lv7NuJMus_!!6000000007646-2-tps-3584-1812.png)

### 发布

首先进行构建

```bash
npm run lowcode:build
```

发布组件

```bash
npm publish
```

这里我发布的组件是 [my-material-demo](https://www.npmjs.com/package/my-material-demo)。在发布之后我们就会有两个重要的文件：

- 低代码描述：[https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js](https://unpkg.com/my-material-demo@0.1.0/build/lowcode/meta.js)
- 组件代码：[https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.js](https://unpkg.com/my-material-demo@0.1.0/build/lowcode/render/default/view.js)

我们也可以从 [https://unpkg.com/my-material-demo@0.1.0/build/lowcode/assets-prod.json](https://unpkg.com/my-material-demo@0.1.0/build/lowcode/assets-prod.json) 找到我们的资产包描述。

```bash
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

### 使用

我们将刚刚发布的组件的 assets-prod.json 的内容放到 demo 的 src/universal/assets.json 中。

> 最好放到最后，防止因为资源加载顺序问题导致出现报错。

如图，新增 packages 配置
![image.png](https://img.alicdn.com/imgextra/i1/O1CN018dnIB91XHmzeTrq3n_!!6000000002899-2-tps-3584-2020.png)

如图，新增 components 配置

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01UNp89s1vQXKyfsFaL_!!6000000006167-2-tps-3584-2020.png)

这时候再启动 DEMO 项目，就会有新的低代码物料了。接下来就按照你们的需求，继续扩展物料吧。

## 总结

这里只是简单的介绍了一些低代码引擎的基础能力，带大家简单的对低代码 DEMO 进行扩展，定制一些新的功能。低代码引擎的能力还有很多很多，可以继续去探索更多的功能。
