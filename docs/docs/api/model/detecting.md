---
title: Detecting
sidebar_position: 6
---
> **@types** [IPublicModelDetecting](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/detecting.ts)<br/>
> **@since** v1.0.0

## 基本介绍

画布节点悬停模型

## 属性

### current

当前 hover 的节点

`@type {IPublicModelNode | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

**@since v1.0.16**

### enable

是否启用

`@type {boolean}`


## 方法
### capture

hover 指定节点

```typescript
/**
 * hover 指定节点
 * capture node with nodeId
 * @param id 节点 id
 */
capture(id: string): void;
```

### release

hover 离开指定节点

```typescript
/**
 * hover 离开指定节点
 * release node with nodeId
 * @param id 节点 id
 */
release(id: string): void;
```

### leave

清空 hover 态

```typescript
/**
 * 清空 hover 态
 * clear all hover state
 */
leave(): void;
```

## 事件
### onDetectingChange
hover 节点变化事件

```typescript
/**
 * hover 节点变化事件
 * set callback which will be called when hovering object changed.
 * @since v1.1.0
 */
onDetectingChange(fn: (node: IPublicModelNode | null) => void): IPublicTypeDisposable;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

**@since v1.1.0**