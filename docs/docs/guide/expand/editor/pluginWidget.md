---
title: 插件扩展 - 面板扩展
sidebar_position: 5
---

## 插件简述

插件功能赋予低代码引擎更高的灵活性，低代码引擎的生态提供了一些官方的插件，但是无法满足所有人的需求，所以提供了强大的插件定制功能。

通过定制插件，在和低代码引擎解耦的基础上，我们可以和引擎核心模块进行交互，从而满足多样化的功能。不仅可以自定义插件的 UI，还可以实现一些非 UI 的逻辑：

1. 调用编辑器框架提供的 API 进行编辑器操作或者 schema 操作；
2. 通过插件类的生命周期函数实现一些插件初始化的逻辑；
3. 通过实现监听编辑器内的消息实现特定的切片逻辑（例如面板打开、面板关闭等）；

> 本文仅介绍面板层面的扩展，编辑器插件层面的扩展可以参考 ["插件扩展 - 编排扩展"](./pluginContextMenu.md) 章节。

## 注册插件 API

```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const pluginA = (ctx: IPublicModelPluginContext, options: any) => {
	return {
    init() {
      console.log(options.key);
      // 往引擎增加面板
      ctx.skeleton.add({
        // area 配置见下方说明
        area: 'leftArea',
        // type 配置见下方说明
        type: 'PanelDock',
        content: <div>demo</div>,
      });
      ctx.logger.log('打个日志');
    },
    destroy() {
      console.log('我被销毁了~');
    },
  };
};

pluginA.pluginName = 'pluginA';

plugins.register(pluginA, { key: 'test' });
```

> 如果您想了解抽取出来的插件如何封装成为一个 npm 包并提供给社区，可以参考[“低代码生态脚手架 & 调试机制”](./cli)章节。

## 面板插件配置说明

面板插件是作用于设计器的，主要是通过按钮、图标等展示在设计器的骨架中。设计器的骨架我们分为下面的几个区域，而我们的插件大多数都是作用于这几个区域的。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01Bkfm9E1MQWmBWeIOh_!!6000000001429-2-tps-1920-1080.png)

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01y05ZHC1Gix0p4nXxH_!!6000000000657-2-tps-3068-1648.png)

### 展示区域 area

#### topArea

展示在设计器的顶部区域，常见的相关区域的插件主要是：、

1. 注册设计器 Logo；
2. 设计器操作回退和撤销按钮；
3. 全局操作按钮，例如：保存、预览等；

#### leftArea

左侧区域的展示形式大多数是 Icon 和对应的面板，通过点击 Icon 可以展示对应的面板并隐藏其他的面板。

该区域相关插件的主要有：

1. 大纲树展示，展示该设计器设计页面的大纲。
2. 组件库，展示注册到设计器中的组件，点击之后，可以从组件库面板中拖拽到设计器的画布中。
3. 数据源面板
4. JS 等代码面板。

可以发现，这个区域的面板大多数操作时是不需要同时并存的，且交互比较复杂的，需要一个更整块的区域来进行操作。

#### centerArea

画布区域，由于画布大多数是展示作用，所以一般扩展的种类比较少。常见的扩展有：

1. 画布大小修改
2. 物料选中扩展区域修改

#### rightArea

右侧区域，常用于组件的配置。常见的扩展有：统一处理组件的配置项，例如统一删除某一个配置项，统一添加某一个配置项的。

#### toolbar

跟 topArea 类似，按需放置面板插件~

### 展示形式 type

#### PanelDock

PanelDock 是以面板的形式展示在设计器的左侧区域的。其中主要有两个部分组成，一个是图标，一个是面板。当点击图标时可以控制面板的显示和隐藏。

下图是组件库插件的展示效果。

![Feb-08-2022 19-44-15.gif](https://img.alicdn.com/imgextra/i3/O1CN01XCrv5Q1hR5BgsyAiq_!!6000000004273-1-tps-1536-790.gif)

其中右上角可以进行固定，可以对弹出的宽度做设定

接入可以参考代码

```javascript
import { skeleton } from '@alilc/lowcode-engine';

skeleton.add({
  area: 'leftArea', // 插件区域
  type: 'PanelDock', // 插件类型，弹出面板
  name: 'sourceEditor',
  content: SourceEditor, // 插件组件实例
  props: {
    align: "left",
    icon: "wenjian",
    description: "JS 面板",
  },
  panelProps: {
    floatable: true, // 是否可浮动
    height: 300,
    hideTitleBar: false,
    maxHeight: 800,
    maxWidth: 1200,
    title: "JS 面板",
    width: 600,
  },
});
```

#### Widget

Widget 形式是直接渲染在当前编辑器的对应位置上。如 demo 中在设计器顶部的所有组件都是这种展现形式。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01h89p5W1pfknnzwMqS_!!6000000005388-2-tps-1988-94.png)

接入可以参考代码：

```javascript
import { skeleton } from '@alilc/lowcode-engine';
// 注册 logo 面板
skeleton.add({
  area: 'topArea',
  type: 'Widget',
  name: 'logo',
  content: Logo, // Widget 组件实例
  contentProps: { // Widget 插件 props
    logo:
    "https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png",
    href: "/",
  },
  props: {
    align: 'left',
    width: 100,
  },
});
```

#### Dock

一个图标的表现形式，可以用于语言切换、跳转到外部链接、打开一个 widget 等场景。

```javascript
import { skeleton } from '@alilc/lowcode-engine';

skeleton.add({
  area: 'leftArea',
  type: 'Dock',
  name: 'opener',
  props: {
    icon: Icon, // Icon 组件实例
    align: 'bottom',
    onClick: function () {
      // 打开外部链接
      window.open('https://lowcode-engine.cn');
      // 显示 widget
      skeleton.showWidget('xxx');
    }
  }
});
```

#### Panel

一般不建议单独使用，通过 PanelDock 使用~

## 实际案例

### 页面管理面板

- 仓库地址：[https://github.com/mark-ck/lowcode-portal](https://github.com/mark-ck/lowcode-portal)
- 具体代码：[https://github.com/mark-ck/lowcode-portal/blob/master/src/plugins/pages-plugin/index.tsx](https://github.com/mark-ck/lowcode-portal/blob/master/src/plugins/pages-plugin/index.tsx)
- 直播回放：
   - [低代码引擎项目实战 (4)-自定义插件 - 页面管理](https://www.bilibili.com/video/BV17a411i73f/)
   - [低代码引擎项目实战 (4)-自定义插件 - 页面管理 - 后端](https://www.bilibili.com/video/BV1uZ4y1U7Ly/)
   - [低代码引擎项目实战 (4)-自定义插件 - 页面管理 - 前端](https://www.bilibili.com/video/BV1Yq4y1a74P/)
   - [低代码引擎项目实战 (4)-自定义插件 - 页面管理 - 完结](https://www.bilibili.com/video/BV13Y4y1e7EV/)

### 区块面板

- 仓库地址：[https://github.com/alibaba/lowcode-plugins](https://github.com/alibaba/lowcode-plugins)
- 具体代码：[https://github.com/alibaba/lowcode-plugins/tree/main/packages/plugin-block](https://github.com/alibaba/lowcode-plugins/tree/main/packages/plugin-block)
- 直播回放：
   - [低代码引擎项目实战 (9)-区块管理 (1)-保存为区块](https://www.bilibili.com/video/BV1YF411M7RK/)
   - [低代码引擎项目实战 (10)-区块管理 - 区块面板](https://www.bilibili.com/video/BV1FB4y1S7tu/)
   - [阿里巴巴低代码引擎项目实战 (11)-区块管理 - ICON 优化](https://www.bilibili.com/video/BV1zr4y1H7Km/)
   - [阿里巴巴低代码引擎项目实战 (11)-区块管理 - 自动截图](https://www.bilibili.com/video/BV1GZ4y117VH/)
   - [阿里巴巴低代码引擎项目实战 (11)-区块管理 - 样式优化](https://www.bilibili.com/video/BV1Pi4y1S7ZT/)
   - [阿里低代码引擎项目实战 (12)-区块管理 (完结)-给引擎插件提个 PR](https://www.bilibili.com/video/BV1hB4y1277o/)
