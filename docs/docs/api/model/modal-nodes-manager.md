---
title: ModalNodesManager
sidebar_position: 7
---
> **@types** [IPublicModelModalNodesManager](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/modal-nodes-manager.ts)<br/>
> **@since** v1.0.0

## 基本介绍

模态节点管理器模型

## 方法

### setNodes

设置模态节点，触发内部事件

```typescript
/**
 * 设置模态节点，触发内部事件
 * set modal nodes, trigger internal events
 */
setNodes(): void;
```

### getModalNodes

获取模态节点（们）

```typescript
/**
 * 获取模态节点（们）
 * get modal nodes
 */
getModalNodes(): IPublicModelNode[];
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### getVisibleModalNode

获取当前可见的模态节点

```typescript
/**
 * 获取当前可见的模态节点
 * get current visible modal node
 */
getVisibleModalNode(): IPublicModelNode | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### hideModalNodes

隐藏模态节点（们）

```typescript
/**
 * 隐藏模态节点（们）
 * hide modal nodes
 */
hideModalNodes(): void;
```

### setVisible

设置指定节点为可见态

```typescript
/**
 * 设置指定节点为可见态
 * set specific model node as visible
 * @param node IPublicModelNode
 */
setVisible(node: IPublicModelNode): void;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### setInvisible

设置指定节点为不可见态

```typescript
/**
 * 设置指定节点为不可见态
 * set specific model node as invisible
 * @param node IPublicModelNode
 */
setInvisible(node: IPublicModelNode): void;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
