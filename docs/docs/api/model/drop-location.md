---
title: DropLocation
sidebar_position: 13
---

> **@types** [IPublicModelDropLocation](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/drop-location.ts)<br/>
> **@since** v1.1.0


## 基本介绍

拖拽放置位置模型

## 属性

### target

拖拽放置位置目标

`@type {IPublicModelNode}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### detail

拖拽放置位置详情

`@type {IPublicTypeLocationDetail}`

相关类型：[IPublicTypeLocationDetail](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/location-detail.ts)

### event

拖拽放置位置对应的事件

`@type {IPublicTypeLocationDetail}`

相关类型：[IPublicModelLocateEvent](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/location-event.ts)

## 方法

### clone

获取一份当前对象的克隆

```typescript
/**
 * 获取一份当前对象的克隆
 * get a clone object of current dropLocation
 */
clone(event: IPublicModelLocateEvent): IPublicModelDropLocation;
```

相关类型：[IPublicModelLocateEvent](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/location-event.ts)