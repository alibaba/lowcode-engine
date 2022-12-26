---
title: Detecting
sidebar_position: 6
---
> **@types** [IPublicModelDetecting](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/detecting.ts)<br/>
> **@since** v1.0.0

## 基本介绍

画布节点悬停模型

## 方法签名
### capture

capture(id: string)

hover 指定节点

### release

release(id: string)

hover 离开指定节点

### leave

leave()

清空 hover 态

### current
当前 hover 的节点

**@since v1.0.16**

### onDetectingChange
hover 节点变化事件

```typescript
/**
 * hover 节点变化事件
 * set callback which will be called when hovering object changed.
 * @since v1.1.0
 */
onDetectingChange(fn: (node: IPublicModelNode) => void): () => void;
```
**@since v1.1.0**