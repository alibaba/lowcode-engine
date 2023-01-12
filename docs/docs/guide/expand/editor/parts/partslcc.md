---
title: 低代码组件
sidebar_position: 2
---
## 什么是低代码组件
我们先了解一下什么是低代码组件，为什么要用低代码组件。

低代码组件是通过可视化的方式生产的组件，这些组件既可以用于低代码搭建体系，也可以用于 ProCode 开发体系（后续迭代）。

那么为什么我们要使用低代码的形式来开发组件：
* <font color="red"><b>首先</b></font>：<b>轻快</b>，低代码组件只需通过浏览器秒级完成初始化工作，不需要 ProCode 繁重的环境准备；<b>环境一致（低代码环境）</b>，同时能够保证物料的开发环境和真实的运行环境是一致的，不会存在开发和运行环境不一致的问题。
* <font color="red"><b>其次</b></font>：<b>通用能力可视化方式抽象，提升研发效能</b>，比如获取远程数据、视图开发、依赖管理、生命周期、事件绑定等功能。
  
<font color="red">低代码组件不是用来替代 ProCode 的开发方式</font>，而是让开发者可以从 ProCode 中重复的工作脱离出来，抽象更多业务垂直的能力，从而起到提效的作用。

## 创建组件

环境准备：我们可以通过 Parts 提供的通用[低代码组件开发环境](https://parts.lowcode-engine.cn/material#/)开发。

点击开发新组件 --> 填写组件标题 --> 填写组件名称 --> 点击确定，完成组件创建工作。

![](https://img.alicdn.com/imgextra/i2/O1CN01OTQRew25y6WxuONIx_!!6000000007594-2-tps-3396-1696.png)

## 组件开发

一张图速览低代码组件开发的功能模块，其中大部分功能可以参考[低代码引擎文档](https://lowcode-engine.cn/site/docs/guide/quickStart/intro)。

![](https://img.alicdn.com/imgextra/i1/O1CN01gx96E121qzv4smV2v_!!6000000007037-2-tps-3456-1930.png)

### 依赖管理

依赖管理用于管理低代码组件本身的依赖（类似于 dependencies）。步骤：点击添加组件 -->  选择安装的组件 --> 保存并构建 (需要等待几分钟构建)。

![](https://img.alicdn.com/imgextra/i4/O1CN01wC9JPK1J9dKLca9wK_!!6000000000986-2-tps-1438-819.png)

### 属性定义

用于定义组件接收外部传入的 propTypes，组件内部可以通过<font color="red">this.props.${属性名称}</font>的方式获取属性值。

属性定义前建议先阅读 [物料描述详解](https://lowcode-engine.cn/site/docs/guide/expand/editor/metaSpec)、[预置设置器](https://lowcode-engine.cn/site/docs/guide/appendix/setters)。

![](https://img.alicdn.com/imgextra/i2/O1CN01wesIJA1nL1eSPrk7U_!!6000000005072-2-tps-1438-821.png)

![](https://img.alicdn.com/imgextra/i3/O1CN01FZIRwv1es9lGplgIB_!!6000000003926-2-tps-1438-821.png)

### 生命周期

低代码组件的开发支持 componentDidMount、componentDidUpdate、componentDidCatch、componentWillUnmount 几个生命周期

![](https://img.alicdn.com/imgextra/i4/O1CN010bnrxJ1oLlujlfFqj_!!6000000005209-2-tps-1438-819.png)

### 组件调试

我们提供了一套线上实时调试的方案，只需点击右上角的调试按钮，就能自动创建一个低代码应用，在这个应用中可以实时调试当前的低代码组件。

![](https://img.alicdn.com/imgextra/i2/O1CN01Tk96vp1xrDeNeIUJD_!!6000000006496-2-tps-1438-820.png)

在低代码应用中使用，组件面板 --> 低代码组件，找到对应的低代码组件拖入画布即可。

![](https://img.alicdn.com/imgextra/i2/O1CN01oGHLea1lzDAhZQQVO_!!6000000004889-2-tps-1438-819.png)

### 组件发布

同时我们提供了组件发布的功能，用于组件版本管理，点击右上角的发布按钮即可发布组件

![](https://img.alicdn.com/imgextra/i2/O1CN017suVAD1NXEC8zQgO1_!!6000000001579-2-tps-1438-821.png)

## 组件使用

组件的消费是通过资产包来管理的，详情请参考 [资产包管理](./partsassets)。

## 组件导出

开发好的低代码组件可以导出成为 React 组件，脱离低代码引擎独立使用。同时导出功能也为您的组件留出一份备份，您可以放心使用本产品的服务，而不用担心万一出现的不能服务的场景。

在物料列表页面，低代码组件会有一个导出的动作。

![](https://img.alicdn.com/imgextra/i2/O1CN016oUByO21spVHZvvw2_!!6000000007041-2-tps-1395-413.png)

点击导出后，就会开启导出低代码组件的过程。这个过程持续 10s+，导出完成后会为您自动下载对应的 zip 包。

![](https://img.alicdn.com/imgextra/i1/O1CN01lctpIo1aDcEvu75Mo_!!6000000003296-2-tps-1399-512.png)

zip 包解压后可以看到一个完整的组件脚手架工程，您可以在这个工程里继续开发调试，或者发布到合适的 npm 源中。

![](https://img.alicdn.com/imgextra/i1/O1CN010aAjsf1xYRPZBAh7d_!!6000000006455-2-tps-2154-1072.png)

注意：目前导出功能暂不支持 低代码组件嵌套。

## 联系我们

<img src="https://img.alicdn.com/imgextra/i2/O1CN01UF88Xi1jC5SZ6m4wt_!!6000000004511-2-tps-750-967.png" width="300" />