---
title: Dragon
sidebar_position: 99
---
> **@types** [IPublicModelDragon](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/dragon.ts)<br/>
> **@since** v1.0.0

## 基本介绍

拖拽对象

### 对应接口
```typescript
import { IPublicModelDragon } from '@alilc/lowcode-types';
```

### 支持版本

**@since** v1.1.0

## 属性

### dragging

是否正在拖动

```typescript
/**
 * is dragging or not
 */
get dragging(): boolean;
```

## 方法

### onDragstart

绑定 dragstart 事件

```typescript
/**
 * 绑定 dragstart 事件
 * bind a callback function which will be called on dragging start
 * @param func
 * @returns
 */
onDragstart(func: (e: IPublicModelLocateEvent) => any): () => void;
```

### onDrag

绑定 drag 事件
```typescript
/**
 * 绑定 drag 事件
 * bind a callback function which will be called on dragging
 * @param func
 * @returns
 */
onDrag(func: (e: IPublicModelLocateEvent) => any): () => void;
```

### onDragend

绑定 dragend 事件

```typescript
/**
 * 绑定 dragend 事件
 * bind a callback function which will be called on dragging end
 * @param func
 * @returns
 */
onDragend(func: (o: { dragObject: IPublicModelDragObject; copy?: boolean }) => any): () => void;
```

### from

设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost

```typescript
/**
 * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
* set a html element as shell to dragon as monitoring target, and
* set boost function which is used to transform a MouseEvent to type
* IPublicTypeDragNodeDataObject.
 * @param shell 拖拽监听的区域
 * @param boost 拖拽转换函数
 */
from(shell: Element, boost: (e: MouseEvent) => IPublicTypeDragNodeDataObject | null): any;
```

### boost

发射拖拽对象
```typescript
/**
 * 发射拖拽对象
 * boost your dragObject for dragging(flying)
 *
 * @param dragObject 拖拽对象
 * @param boostEvent 拖拽初始时事件
 */
boost(dragObject: IPublicTypeDragObject, boostEvent: MouseEvent | DragEvent, fromRglNode?: IPublicModelNode): void;
```

### addSensor

添加投放感应区

```typescript
/**
 * 添加投放感应区
 * add sensor area
 */
addSensor(sensor: any): void;
```

### removeSensor

移除投放感应

```typescript
/**
 * 移除投放感应
 * remove sensor area
 */
removeSensor(sensor: any): void;
```