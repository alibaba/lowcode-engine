---
title: cavas - 画布 API
sidebar_position: 12
---

> **@types** [IPublicApiCanvas](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/canvas.ts)<br/>
> **@since** v1.1.0


## 模块简介

通过该模块可以触达对画布拖拽相关的一些能力。

## 变量

### dragon

获取拖拽操作对象的实例

```typescript
/**
 * 获取拖拽操作对象的实例
 * get dragon instance, you can use this to obtain draging related abilities and lifecycle hooks
 * @since v1.1.0
 */
get dragon(): IPublicModelDragon | null;
```
关联模型 [IPublicModelDragon](./model/dragon)

### activeTracker

获取活动追踪器实例

```typescript
/**
 * 获取活动追踪器实例
 * get activeTracker instance, which is a singleton running in engine.
 * it tracks document`s current focusing node/node[], and notify it`s subscribers that when
 * focusing node/node[] changed.
 * @since v1.1.0
 */
get activeTracker(): IPublicModelActiveTracker | null;
```

## 方法签名

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
 * a Scroller is a controller that gives a view (IPublicModelScrollable) the ability scrolling
 * to some cordination by api scrollTo.
 *
 * when a scroller is inited, will need to pass is a scrollable, which has a scrollTarget.
 * and when scrollTo(options: { left?: number; top?: number }) is called, scroller will
 * move scrollTarget`s top-left corner to (options.left, options.top) that passed in.
 * @since v1.1.0
 */
createScroller(scrollable: IPublicModelScrollable): IPublicModelScroller;

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