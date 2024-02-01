---
title: canvas - 画布 API
sidebar_position: 10
---

> **@types** [IPublicApiCanvas](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/canvas.ts)<br/>
> **@since** v1.1.0


## 模块简介

通过该模块可以触达对画布拖拽相关的一些能力。

## 变量

### dragon

获取拖拽操作对象的实例

`@type {IPublicModelDragon | null}`


相关类型：[IPublicModelDragon](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/dragon.ts)

### activeTracker

获取活动追踪器实例

`@type {IPublicModelActiveTracker | null}`

相关类型：[IPublicModelActiveTracker](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/active-tracker.ts)

### isInLiveEditing

是否处于 LiveEditing 状态

`@type {boolean}`

### clipboard
全局剪贴板实例

`@type {IPublicModelClipboard}`

相关类型：[IPublicModelClipboard](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/clipboard.ts)

## 方法

### createLocation
创建一个文档插入位置对象，该对象用来描述一个即将插入的节点在文档中的位置

```typescript
/**
 * 创建一个文档插入位置对象，该对象用来描述一个即将插入的节点在文档中的位置
 * create a drop location for document, drop location describes a location in document
 * @since v1.1.0
 */
createLocation(locationData: IPublicTypeLocationData): IPublicModelDropLocation;
```

### createScroller
创建一个滚动控制器 Scroller，赋予一个视图滚动的基本能力，
```typescript
/**
 * 创建一个滚动控制器 Scroller，赋予一个视图滚动的基本能力，
 * a Scroller is a controller that gives a view (IPublicTypeScrollable) the ability scrolling
 * to some cordination by api scrollTo.
 *
 * when a scroller is inited, will need to pass is a scrollable, which has a scrollTarget.
 * and when scrollTo(options: { left?: number; top?: number }) is called, scroller will
 * move scrollTarget`s top-left corner to (options.left, options.top) that passed in.
 * @since v1.1.0
 */
createScroller(scrollable: IPublicTypeScrollable): IPublicModelScroller;

```

### createScrollTarget
创建一个 ScrollTarget，与 Scroller 一起发挥作用，详见 [createScroller](#createscroller) 中的描述

```typescript
/**
 * 创建一个 ScrollTarget，与 Scroller 一起发挥作用，详见 createScroller 中的描述
 * this works with Scroller, refer to createScroller`s description
 * @since v1.1.0
 */
createScrollTarget(shell: HTMLDivElement): IPublicModelScrollTarget;
```
