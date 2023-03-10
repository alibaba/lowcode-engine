---
title: Selection
sidebar_position: 6
---
> **@types** [IPublicModelSelection](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/selection.ts)<br/>
> **@since** v1.0.0

## 基本介绍

画布节点选中模型

## 属性
### selected

返回选中的节点 id

`@type {string[]}`

### node
返回选中的节点（如多个节点只返回第一个）

`@type {IPublicModelNode | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

**@since v1.1.0**

## 方法
### select

选中指定节点（覆盖方式）

```typescript
/**
* 选中指定节点（覆盖方式）
* select node with id, this will override current selection
* @param id
*/
select(id: string): void;
```

### selectAll

批量选中指定节点们

```typescript
/**
* 批量选中指定节点们
* select node with ids, this will override current selection
*
* @param ids
*/
selectAll(ids: string[]): void;
```

### remove

**取消选中**选中的指定节点，不会删除组件

```typescript
/**
* 移除选中的指定节点
* remove node from selection with node id
* @param id
*/
remove(id: string): void;
```

### clear

**取消选中**所有选中节点，不会删除组件

```typescript
/**
* 清除所有选中节点
* clear current selection
*/
clear(): void;
```

### has

判断是否选中了指定节点

```typescript
/**
* 判断是否选中了指定节点
* check if node with specific id is selected
* @param id
*/
has(id: string): boolean;
```

### add

选中指定节点（增量方式）

```typescript
/**
* 选中指定节点（增量方式）
* add node with specific id to selection
* @param id
*/
add(id: string): void;
```

### getNodes

获取选中的节点实例

```typescript
/**
* 获取选中的节点实例
* get selected nodes
*/
getNodes(): IPublicModelNode[];
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### getTopNodes
获取选区的顶层节点
例如选中的节点为：

- DivA
   - ChildrenA
- DivB

getNodes 返回的是 [DivA、ChildrenA、DivB]，getTopNodes 返回的是 [DivA、DivB]，其中 ChildrenA 由于是二层节点，getTopNodes 不会返回

```typescript
/**
* 获取选区的顶层节点
* get seleted top nodes
* for example:
*  getNodes() returns [A, subA, B], then
*  getTopNodes() will return [A, B], subA will be removed
* @since v1.0.16
*/
getTopNodes(includeRoot?: boolean): IPublicModelNode[];
```

**@since v1.0.16**

## 事件
### onSelectionChange

注册 selection 变化事件回调

```typescript
/**
* 注册 selection 变化事件回调
* set callback which will be called when selection is changed
* @since v1.1.0
*/
onSelectionChange(fn: (ids: string[]) => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

**@since v1.1.0**