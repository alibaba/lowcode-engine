---
title: DocumentModel
sidebar_position: 0
---
> **@types** [IPublicModelDocumentModel](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/document-model.ts)<br/>
> **@since** v1.0.0

## 基本介绍

文档模型

## 变量

### selection

画布节点选中区模型实例，具体方法参见 [画布节点选中区模型](./selection)

### detecting

画布节点 hover 区模型实例，具体方法参见 [画布节点悬停模型](./detecting)

### history

操作历史模型实例，具体方法参见 [操作历史模型](./history)
### canvas

获取当前画布中的一些信息，比如拖拽时的 dropLocation

### project

获取当前文档模型所属的 project

### root

获取文档的根节点

### nodesMap

获取文档下所有节点

### modalNodesManager

参见 [模态节点管理](./modal-nodes-manager)

### dropLocation
文档的 dropLocation
相关类型：[IPublicModelDropLocation](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/drop-location.ts)

**@since v1.1.0**

## 方法签名
### getNodeById

getNodeById(nodeId: string)

根据 nodeId 返回 [Node](./node) 实例

### importSchema

importSchema(schema: RootSchema)

导入 schema
### exportSchema

exportSchema(stage: TransformStage = TransformStage.Render)

导出 schema

### insertNode

insertNode(
    parent: Node,
    thing: Node,
    at?: number | null | undefined,
    copy?: boolean | undefined,
  )

插入节点
### createNode

createNode(data: any)

创建一个节点
### removeNode

removeNode(idOrNode: string | Node)

移除指定节点/节点id

### checkNesting
检查拖拽放置的目标节点是否可以放置该拖拽对象

**@since v1.0.16**

```typescript
function checkNesting(dropTarget: Node, dragObject: DragNodeObject | DragNodeDataObject): boolean {}
```

### isDetectingNode
检查拖拽放置的目标节点是否可以放置该拖拽对象

```typescript
/**
 * 判断是否当前节点处于被探测状态
 * check is node being detected
 * @param node
 * @since v1.1.0
 */
isDetectingNode(node: IPublicModelNode): boolean;
```
相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


**@since v1.1.0**


## 事件
### onAddNode

onAddNode(fn: (node: Node) => void)

当前 document 新增节点事件

```typescript
import { project } from '@alilc/lowcode-engine';

project.currentDocument.onAddNode((node) => {
  console.log('node', node);
})
```

### onRemoveNode

onRemoveNode(fn: (node: Node) => void)

当前 document 删除节点事件

### onChangeDetecting

onChangeDetecting(fn: (node: Node) => void)

当前 document 的 hover 变更事件

### onChangeSelection

onChangeSelection(fn: (ids: string[]) => void)

当前 document 的选中变更事件

### onChangeNodeVisible

onChangeNodeVisible(fn: (node: Node, visible: boolean) => void)

当前 document 的节点显隐状态变更事件

### onChangeNodeChildren

onChangeNodeChildren(fn: (info?: IPublicOnChangeOptions) => void)

当前 document 的节点 children 变更事件

### onChangeNodeProp
当前 document 节点属性修改事件

```typescript
onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions) => void)
```

### onImportSchema
当前 document 导入新的 schema 事件
```typescript
/**
 * import schema event
 * @param fn
 * @since v1.0.15
 */
onImportSchema(fn: (schema: IPublicTypeRootSchema) => void): IPublicTypeDisposable;
```
相关类型：
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)
- [IPublicTypeRootSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/root-schema.ts)

**@since v1.0.15**

### onFocusNodeChanged
设置聚焦节点变化的回调

```typescript
/**
 * 设置聚焦节点变化的回调
 * triggered focused node is set mannually from plugin
 * @param fn
 * @since v1.1.0
 */
onFocusNodeChanged(
  fn: (doc: IPublicModelDocumentModel, focusNode: IPublicModelNode) => void,
): IPublicTypeDisposable;
```
相关类型：
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

**@since v1.1.0**

### onDropLocationChanged
设置 DropLocation 变化的回调

```typescript
/**
 * 设置 DropLocation 变化的回调
 * triggered when drop location changed
 * @param fn
 * @since v1.1.0
 */
onDropLocationChanged(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

**@since v1.1.0**