---
title: 接入编辑器
sidebar_position: 0
---

您有两种方式初始化低代码编辑器：

1. clone 低代码项目的官方 demo，直接启动项目。适合普通人。
2. 手工引入低代码 UMD 包，手工配置、打包和启动。适合 Webpack 配置工程师。

# 方法 1: Clone 并启动

可以通过两种方式之一获取低代码编辑器的示例代码：

1. 直接[在 github 仓库下](https://github.com/alibaba/lowcode-demo)进行下载

![Rectangle 2.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1645178084931-b81f6960-f0be-4695-ae38-e2632c859629.png#clientId=u6721b06e-9fb2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=259&id=ud829c08c&margin=%5Bobject%20Object%5D&name=Rectangle%202.png&originHeight=517&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=163331&status=done&style=none&taskId=ua56b6104-b23f-4dd6-a95c-4fa8ac8cb3c&title=&width=750)

2. 如果本地安装了 git，可以通过 git clone 方式进行下载

（这个方法的好处是 demo 有了更新，可以通过 merge 方式跟上）
```typescript
git clone https://github.com/alibaba/lowcode-demo.git
```

拉取仓库代码后，需要进行如下配置或安装过程：

1. 确保本地安装了 Node.js 和 npm，如果没有，[您可以通过 nvm 进行快捷的安装](https://github.com/nvm-sh/nvm)
2. 确保为 npm [设置了可以访问的 npm 源，保证安装过程无网络问题](https://npmmirror.com/)
3. 执行 `npm install`

依赖完全安装完成后，执行 `npm start`，如果看到这个界面，说明项目启动成功。您可以继续看后续章节了。本章节后续内容均为高级配置方式。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/242652/1644982015764-35bb5f58-fbd6-4838-9792-3c5b2136162d.png#clientId=ub335956d-fdf2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=817&id=u01bca493&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1634&originWidth=3060&originalType=binary&ratio=1&rotation=0&showTitle=false&size=216709&status=done&style=stroke&taskId=u467c43dc-35c5-4c84-907d-d6db9a0b839&title=&width=1530)

# 方法 2: 手工引入低代码 UMD 包，手工配置打包和启动

如果您不是从零开始的项目，您可能需要手工引入低代码引擎。

## 引入 UMD 包资源

我们需要在启动前，正确在项目中通过 UMD 包方式直接依赖如下内容：
（亦可使用异步加载工具，如果您按照正确的顺序进行加载）
```html
<!-- 低代码引擎的页面框架样式 -->
<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/css/engine-core.css" />
<!-- Fusion Next 控件样式 -->
<link rel="stylesheet" href="https://g.alicdn.com/code/lib/alifd__next/1.23.24/next.min.css">
<!-- 低代码引擎的页面主题样式，可以替换为 theme-lowcode-dark -->
<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alifd/theme-lowcode-light/0.2.0/next.min.css">
<!-- 低代码引擎官方扩展的样式 -->
<link rel="stylesheet" href="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/css/engine-ext.css" />

<!-- React，可替换为 production 包 -->
<script src="https://g.alicdn.com/code/lib/react/16.14.0/umd/react.development.js"></script>
<!-- React DOM，可替换为 production 包 -->
<script src="https://g.alicdn.com/code/lib/react-dom/16.14.0/umd/react-dom.development.js"></script>
<!-- React 向下兼容，预防物料层的依赖 -->
<script src="https://g.alicdn.com/code/lib/prop-types/15.7.2/prop-types.js"></script>
<script src="https://g.alicdn.com/platform/c/react15-polyfill/0.0.1/dist/index.js"></script>
<!-- lodash，低代码编辑器的依赖 -->
<script src="https://g.alicdn.com/platform/c/lodash/4.6.1/lodash.min.js"></script>
<!-- 日期处理包，Fusion Next 的依赖 -->
<script src="https://g.alicdn.com/code/lib/moment.js/2.29.1/moment-with-locales.min.js"></script>
<!-- Fusion Next 的主包，低代码编辑器的依赖 -->
<script src="https://g.alicdn.com/code/lib/alifd__next/1.23.24/next.min.js"></script>
<!-- 低代码引擎的主包 -->
<script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine@latest/dist/js/engine-core.js"></script>
<!-- 低代码引擎官方扩展的主包 -->
<script crossorigin="anonymous" src="https://alifd.alicdn.com/npm/@alilc/lowcode-engine-ext@latest/dist/js/engine-ext.js"></script>
```
> 注：如果 unpkg 的服务比较缓慢，您可以使用 alicdn 来获得确定版本的低代码引擎，如对于引擎的 1.0.1 版本，可用 [https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.1/dist/js/engine-core.js](https://alifd.alicdn.com/npm/@alilc/lowcode-engine@1.0.1/dist/js/engine-core.js)


## 配置打包

因为这些资源已经通过  UMD 方式引入，所以在 Webpack 等构建工具中需要配置它们为 external，不再重复打包：

```javascript
{
  "externals": {
    "react": "var window.React",
    "react-dom": "var window.ReactDOM",
    "prop-types": "var window.PropTypes",
    "@alifd/next": "var window.Next",
    "@alilc/lowcode-engine": "var window.AliLowCodeEngine",
    "@alilc/lowcode-editor-core": "var window.AliLowCodeEngine.common.editorCabin",
    "@alilc/lowcode-editor-skeleton": "var window.AliLowCodeEngine.common.skeletonCabin",
    "@alilc/lowcode-designer": "var window.AliLowCodeEngine.common.designerCabin",
    "@alilc/lowcode-engine-ext": "var window.AliLowCodeEngineExt",
    "@ali/lowcode-engine": "var window.AliLowCodeEngine",
    "moment": "var window.moment",
    "lodash": "var window._"
  }
}
```

## 初始化低代码编辑器

### 方法 2.1 使用 init 进行初始化

正确引入后，我们可以直接通过 window 上的变量进行引用，如 `window.AliLowCodeEngine.init`。您可以直接通过此方式初始化低代码引擎：

```javascript
// 确保在执行此命令前，在 <body> 中已有一个 id 为 lce-container 的 <div />
window.AliLowCodeEngine.init(document.getElementById('lce-container'), {
  enableCondition: true,
  enableCanvasLock: true,
});
```

如果您的项目中使用了 TypeScript，您可以通过如下 devDependencies 引入相关包，并获得对应的类型推断。
```javascript
// package.json
{
  "devDependencies": {
    "@alilc/lowcode-engine": "beta"
  }
}
```
```javascript
import { init } from '@alilc/lowcode-engine';

init(document.getElementById('lce-container'), {
  enableCondition: true,
  enableCanvasLock: true,
});
```

init 的功能包括但不限于：

1. 传递 options 并设置 config 对象；
2. 传递 preference 并设置 plugins 入参；
3. 初始化 Workbench；

> 本节中的低代码编辑器例子可以在 demo 中找到：[https://github.com/alibaba/lowcode-demo/blob/main/src/index.ts#L21-L34](https://github.com/alibaba/lowcode-demo/blob/main/src/index.ts#L21-L34)


### 方法 2.2 使用 skeletonCabin.Workbench 方式初始化

`init()` 内部会调用 `ReactDOM.render()` 函数，因此这样初始化的内容没有办法与外部的 React 组件进行通信，也就没有办法在一些自定义的 plugin 中获取 redux 上的全局数据等内容。
因此，这种场景下您可以通过 `skeletonCabin.Workbench` 进行初始化。

> 注：您不需要同时使用 2.1 和 2.2 的方法。根据使用场景，只有需要低代码引擎插件和外界进行一定通信时，2.2 提供的方法才是必要的。


```javascript
import React, { useState, useEffect } from 'react'
import { project, plugins, common, skeleton } from '@alilc/lowcode-engine'

// 此 schema 参考 demo 中的默认 schema 书写
import userSchema from './schema.json'

export default function EditorView() {
  /** 插件是否已初始化成功，因为必须要等插件初始化后才能渲染 Workbench */
  const [hasPluginInited, setHasPluginInited] = useState(false);

  useEffect(() => {
    plugins.init().then(() => {
      setHasPluginInited(true)
    }).catch(err => console.error(err))
  }, []);

  useEffect(() => {
    project.importSchema(userSchema)
  }, [userSchema]);

  if (!hasPluginInited) {
    return null;
  }

  return (
    <common.skeletonCabin.Workbench
      skeleton={skeleton}
    />
  );
}
```

> 本节中的低代码编辑器类似的例子可以在 demo 中找到：[https://github.com/alibaba/lowcode-demo/blob/main/src/scenarios/custom-initialization/index.tsx](https://github.com/alibaba/lowcode-demo/blob/main/src/scenarios/custom-initialization/index.tsx)


# 配置低代码编辑器
详见“低代码扩展简述“章节。
