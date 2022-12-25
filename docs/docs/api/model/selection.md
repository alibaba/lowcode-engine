---
title: Selection
sidebar_position: 6
---
> **@types** [IPublicModelSelection](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/selection.ts)<br/>
> **@since** v1.0.0

## 基本介绍

画布节点选中模型

## 变量
### selected

返回选中的节点 id

## 方法签名
### select

select(id: string)

选中指定节点（覆盖方式）

### selectAll

selectAll(ids: string[])

批量选中指定节点们

### remove

remove(id: string)

**取消选中**选中的指定节点，不会删除组件

### clear

clear()

**取消选中**所有选中节点，不会删除组件

### has

has(id: string)

判断是否选中了指定节点

### add

add(id: string)

选中指定节点（增量方式）

### getNodes

getNodes()

获取选中的节点实例

### getTopNodes
获取选区的顶层节点
例如选中的节点为：

- DivA
   - ChildrenA
- DivB

getNodes 返回的是 [DivA、ChildrenA、DivB]，getTopNodes 返回的是 [DivA、DivB]，其中 ChildrenA 由于是二层节点，getTopNodes 不会返回

**@since v1.0.16**

### onSelectionChange

注册 selection 变化事件回调

```typescript
/**
 * 注册 selection 变化事件回调
 * set callback which will be called when selection is changed
 * @since v1.1.0
 */
onSelectionChange(fn: (ids: string[]) => void): () => void;
```

**@since v1.1.0**