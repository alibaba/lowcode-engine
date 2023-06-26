---
title: 渲染模块设计
sidebar_position: 4
---
## 低代码渲染介绍

<img src="https://img.alicdn.com/imgextra/i1/O1CN01TXW6Ku1iQSGIPzncW_!!6000000004407-2-tps-1440-872.png" width="400"/>

基于 Schema 和物料组件，如何渲染出我们的页面？这一节描述的就是这个。

## npm 包与仓库信息

- React 框架渲染 npm 包：@alilc/lowcode-react-renderer
- Rax 框架渲染 npm 包：@alilc/lowcode-rax-renderer
- 仓库：[https://github.com/alibaba/lowcode-engine](https://github.com/alibaba/lowcode-engine) 下的
   - packages/renderer-core
   - packages/react-renderer
   - packages/react-simulator-renderer

## 渲染框架原理
### 整体架构

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01i4IiSR1cMtUFXaWQq_!!6000000003587-2-tps-1686-1062.png)

- 协议层：基于[《低代码引擎搭建协议规范》](/site/docs/specs/lowcode-spec) 产出的 Schema 作为我们的规范协议。
- 能力层：提供组件、区块、页面等渲染所需的核心能力，包括 Props 解析、样式注入、条件渲染等。
- 适配层：由于我们使用的运行时框架不是统一的，所以统一使用适配层将不同运行框架的差异部分，通过接口对外，让渲染层注册/适配对应所需的方法。能保障渲染层和能力层直接通过适配层连接起来，能起到独立可扩展的作用。
- 渲染层：提供核心的渲染方法，由于不同运行时框架提供的渲染方法是不同的，所以其通过适配层进行注入，只需要提供适配层所需的接口，即可实现渲染。
- 应用层：根据渲染层所提供的方法，可以应用到项目中，根据使用的方法和规模即可实现应用、页面、区块的渲染。

### 核心解析

这里主要解析一下刚刚提到的架构中的适配层和渲染层。

#### 适配层
适配层提供的是各个框架之间的差异项。比如 `React.createElement` 和 `Rax.createElement` 方法是不同的。所以需要在适配层对 API 进行抹平。

##### React
```typescript
import { createElement } from 'react';
import {
  adapter,
} from '@ali/lowcode-renderer-core';

adapter.setRuntime({
  createElement,
});
```
##### Rax
```typescript
import { createElement } from 'rax';
import {
  adapter,
} from '@ali/lowcode-renderer-core';

adapter.setRuntime({
  createElement,
});
```
这时，在核心层使用的 `createElement` 会基于使用不同的 renderer 而使用不同的方法，自动适配框架所需的运行时方法。

所需的方法包括：

- `setRuntime`：设置运行时相关方法
   - `Component`：组件类，参考 React 的 `Component`。
   - `PureComponent`：组件类，参考 React 的 `PureComponent`。
   - `createContext`：创建一个 `Context` 对象的方法。例如，当 React 渲染一个订阅了这个 `Context` 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 `context` 值。
   - `createElement`：创建 `Component` 元素，例如在 React 中即为创建 React 元素。
   - `forwardRef`：ref 转发的方法。Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。
   - `findDOMNode`：是一个访问底层 DOM 节点的方法。如果组件已经被挂载到 DOM 上，此方法会返回浏览器中相应的原生 DOM 元素。
- `setRenderers`
   - `PageRenderer`：页面渲染的方法。可以定制页面渲染的生命周期，定制导航，定制路由等。
   - `ComponentRenderer`：组件渲染的方法。
   - `BlockRenderer`：区块渲染的方法。

#### 渲染层
##### React Renderer
内部的技术栈统一都是 React，大多数适配层的 API 都是按照 React 来设计的，所以对于 React Renderer 来说，需要做的不多。

React Renderer 的代码量很少，主要是将 React API 注册到适配层中。

```typescript
import React, { Component, PureComponent, createElement, createContext, forwardRef, ReactInstance, ContextType } from 'react';
import ReactDOM from 'react-dom';
import {
  adapter,
  pageRendererFactory,
  componentRendererFactory,
  blockRendererFactory,
  addonRendererFactory,
  tempRendererFactory,
  rendererFactory,
  types,
} from '@ali/lowcode-renderer-core';
import ConfigProvider from '@alifd/next/lib/config-provider';

window.React = React;
(window as any).ReactDom = ReactDOM;

adapter.setRuntime({
  Component,
  PureComponent,
  createContext,
  createElement,
  forwardRef,
  findDOMNode: ReactDOM.findDOMNode,
});

adapter.setRenderers({
  PageRenderer: pageRendererFactory(),
  ComponentRenderer: componentRendererFactory(),
  BlockRenderer: blockRendererFactory(),
  AddonRenderer: addonRendererFactory(),
  TempRenderer: tempRendererFactory(),
  DivRenderer: blockRendererFactory(),
});

adapter.setConfigProvider(ConfigProvider);
```

##### Rax Renderer
Rax 的大多数 API 和 React 基本也是一致的，差异点在于重写了一些方法。
```typescript
import { Component, PureComponent, createElement, createContext, forwardRef } from 'rax';
import findDOMNode from 'rax-find-dom-node';
import {
  adapter,
  addonRendererFactory,
  tempRendererFactory,
  rendererFactory,
} from '@ali/lowcode-renderer-core';
import pageRendererFactory from './renderer/page';
import componentRendererFactory from './renderer/component';
import blockRendererFactory from './renderer/block';
import CompFactory from './hoc/compFactory';

adapter.setRuntime({
  Component,
  PureComponent,
  createContext,
  createElement,
  forwardRef,
  findDOMNode,
});

adapter.setRenderers({
  PageRenderer: pageRendererFactory(),
  ComponentRenderer: componentRendererFactory(),
  BlockRenderer: blockRendererFactory(),
  AddonRenderer: addonRendererFactory(),
  TempRenderer: tempRendererFactory(),
});
```

### 多模式渲染
#### 预览模式渲染
预览模式的渲染，主要是通过 Schema、components 即可完成上述的页面渲染能力。
```typescript
import ReactRenderer from '@ali/lowcode-react-renderer';
import ReactDOM from 'react-dom';
import { Button } from '@alifd/next';

const schema = {
  componentName: 'Page',
  props: {},
  children: [
    {
      componentName: 'Button',
      props: {
        type: 'primary',
        style: {
          color: '#2077ff'
        },
      },
      children: '确定',
    },
  ],
};

const components = {
  Button,
};

ReactDOM.render((
  <ReactRenderer
    schema={schema}
    components={components}
  />
), document.getElementById('root'));
```

#### 设计模式渲染（Simulator）
设计模式渲染就是将编排生成的《搭建协议》渲染成视图的过程，视图是可以交互的，所以必须要处理好内部数据流、生命周期、事件绑定、国际化等等。也称为画布的渲染，画布是 UI 编排的核心，它一般融合了页面的渲染以及组件/区块的拖拽、选择、快捷配置。
画布的渲染和预览模式的渲染的区别在于，画布的渲染和设计器之间是有交互的。所以在这里我们新增了一层 `Simulator` 作为设计器和渲染的连接器。
`Simulator` 是将设计器传入的 `DocumentModel` 和组件/库描述转成相应的 Schema 和 组件类。再调用 Render 层完成渲染。我们这里介绍一下它提供的能力。
##### 整体架构
![image.png](https://img.alicdn.com/imgextra/i2/O1CN017cYBAp1hvJKPUVLbx_!!6000000004339-2-tps-1500-864.png)

- `Project`：位于顶层的 Project，保留了对所有文档模型的引用，用于管理应用级 Schema 的导入与导出。
- `Document`：文档模型包括 Simulator 与数据模型两部分。Simulator 通过一份 Simulator Host 协议与数据模型层通信，达到画布上的 UI 操作驱动数据模型变化。通过多文档的设计及多 Tab 交互方式，能够实现同时设计多个页面，以及在一个浏览器标签里进行搭建与配置应用属性。
- `Simulator`：模拟器主要承载特定运行时环境的页面渲染及与模型层的通信。
- `Node`：节点模型是对可视化组件/区块的抽象，保留了组件属性集合 Props 的引用，封装了一系列针对组件的 API，比如修改、编辑、保存、拖拽、复制等。
- `Props`：描述了当前组件所维系的所有可以「设计」的属性，提供一系列操作、遍历和修改属性的方法。同时保持对单个属性 Prop 的引用。
- `Prop`：属性模型 Prop 与当前可视化组件/区块的某一具体属性想映射，提供了一系列操作属性变更的 API。
- `Settings`：`SettingField` 的集合。
- `SettingField`：它连接属性设置器 `Setter` 与属性模型 `Prop`，它是实现多节点属性批处理的关键。
- 通用交互模型：内置了拖拽、活跃追踪、悬停探测、剪贴板、滚动、快捷键绑定。

##### 模拟器介绍
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01GF1PMj288kxovvnK8_!!6000000007888-2-tps-1500-740.png)

- 运行时环境：从运行时环境来看，目前我们有 React 生态、Rax 生态。而在对外的历程中，我们也会拥有 Vue 生态、Angular 生态等。
- 布局模式：不同于 C 端营销页的搭建，中后台场景大多是表单、表格，流式布局是主流的选择。对于设计师、产品来说，是需要绝对布局的方式来进行页面研发的。
- 研发场景：从研发场景来看，低代码搭建不仅有页面编排，还有诸如逻辑编排、业务编排的场景。

基于以上思考，我们通过基于沙箱隔离的模拟器技术来实现了多运行时环境（如 React、Rax、小程序、Vue）、多模式（如流式布局、自由布局）、多场景（如页面编排、关系图编排）的 UI 编排。通过注册不同的运行时环境的渲染模块，能够实现编辑器从 React 页面搭建到 Rax 页面搭建的迁移。通过注册不同的模拟器画布，你可以基于 G6 或者 mxgraph 来做关系图编排。你可以定制一个流式布局的画布，也可以定制一个自由布局的画布。
