---
title: DocumentModel
sidebar_position: 0
---
> **@types** [IPublicModelDocumentModel](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/document-model.ts)<br/>
> **@since** v1.0.0

## 基本介绍

文档模型

## 属性

### id

唯一 ID

`@type {string}`

### selection

画布节点选中区模型实例

`@type {IPublicModelSelection}`

相关章节：[节点选中区模型](./selection)

相关类型：[IPublicModelSelection](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/selection.ts)

### detecting

画布节点 hover 区模型实例

`@type {IPublicModelDetecting}`

相关章节：[画布节点悬停模型](./detecting)

相关类型：[IPublicModelDetecting](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/detecting.ts)

### history

操作历史模型实例

`@type {IPublicModelHistory}`

相关章节：[操作历史模型](./history)

相关类型：[IPublicModelHistory](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/history.ts)

### project

获取当前文档模型所属的 project

`@type {IPublicApiProject}`

相关类型：[IPublicApiProject](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/project.ts)

### root

获取文档的根节点

`@type {IPublicModelNode | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### nodesMap

获取文档下所有节点 Map, key 为 nodeId

`@type {Map<string, IPublicModelNode>} `


相关章节：[节点模型](./node)

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### modalNodesManager

模态节点管理器

`@type {IPublicModelModalNodesManager | null}`

相关章节：[模态节点管理](./modal-nodes-manager)

相关类型：[IPublicModelModalNodesManager](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/modal-nodes-manager.ts)

### dropLocation

文档的 dropLocation

`@type {IPublicModelDropLocation | null}`


相关类型：[IPublicModelDropLocation](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/drop-location.ts)

**@since v1.1.0**

## 方法
### getNodeById

根据 nodeId 返回 [Node](./node) 实例

```typescript
/**
 * 根据 nodeId 返回 Node 实例
 * get node by nodeId
 * @param nodeId
 * @returns
 */
getNodeById(nodeId: string): IPublicModelNode | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### importSchema

导入 schema

```typescript
/**
 * 导入 schema
 * import schema data
 * @param schema
 */
importSchema(schema: IPublicTypeRootSchema): void;
```

相关类型：[IPublicTypeRootSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/root-schema.ts)


### exportSchema
导出 schema

```typescript
/**
 * 导出 schema
 * export schema
 * @param stage
 * @returns
 */
exportSchema(stage: IPublicEnumTransformStage): IPublicTypeRootSchema | undefined;
```

相关类型：
- [IPublicEnumTransformStage](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/enum/transform-stage.ts)
- [IPublicTypeRootSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/root-schema.ts)

### insertNode

插入节点

```typescript
/**
 * 插入节点
 * insert a node
 */
insertNode(
  parent: IPublicModelNode,
  thing: IPublicModelNode,
  at?: number | null | undefined,
  copy?: boolean | undefined
): IPublicModelNode | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### createNode

创建一个节点

```typescript
/**
 * 创建一个节点
 * create a node
 * @param data
 * @returns
 */
createNode(data: any): IPublicModelNode | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### removeNode

移除指定节点/节点id

```typescript
/**
 * 移除指定节点/节点id
 * remove a node by node instance or nodeId
 * @param idOrNode
 */
removeNode(idOrNode: string | IPublicModelNode): void;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### checkNesting
检查拖拽放置的目标节点是否可以放置该拖拽对象

```typescript
/**
 * 检查拖拽放置的目标节点是否可以放置该拖拽对象
 * check if dragOjbect can be put in this dragTarget
 * @param dropTarget 拖拽放置的目标节点
 * @param dragObject 拖拽的对象
 * @returns boolean 是否可以放置
 * @since v1.0.16
 */
checkNesting(
  dropTarget: IPublicModelNode,
  dragObject: IPublicTypeDragNodeObject | IPublicTypeDragNodeDataObject
): boolean;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeDragNodeObject](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/drag-node-object.ts)
- [IPublicTypeDragNodeDataObject](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/drag-node-object-data.ts)

**@since v1.0.16**

### isDetectingNode
判断是否当前节点处于被探测状态

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

当前 document 新增节点事件

```typescript
/**
 * 当前 document 新增节点事件
 * set callback for event on node is created for a document
 */
onAddNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onMountNode

当前 document 新增节点事件，此时节点已经挂载到 document 上

```typescript
/**
 * 当前 document 新增节点事件，此时节点已经挂载到 document 上
 * set callback for event on node is mounted to canvas
 */
onMountNode(fn: (payload: { node: IPublicModelNode }) => void): IPublicTypeDisposable;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onRemoveNode
当前 document 删除节点事件

```typescript
/**
 * 当前 document 删除节点事件
 * set callback for event on node is removed
 */
onRemoveNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)


### onChangeDetecting

当前 document 的 hover 变更事件

```typescript
/**
 * 当前 document 的 hover 变更事件
 *
 * set callback for event on detecting changed
 */
onChangeDetecting(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onChangeSelection

当前 document 的选中变更事件

```typescript
/**
 * 当前 document 的选中变更事件
 * set callback for event on selection changed
 */
onChangeSelection(fn: (ids: string[]) => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onChangeNodeVisible

当前 document 的节点显隐状态变更事件

```typescript
/**
 * 当前 document 的节点显隐状态变更事件
 * set callback for event on visibility changed for certain node
 * @param fn
 */
onChangeNodeVisible(fn: (node: IPublicModelNode, visible: boolean) => void): IPublicTypeDisposable;
```

- 相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- 相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onChangeNodeChildren

当前 document 的节点 children 变更事件

```typescript
onChangeNodeChildren(fn: (info?: IPublicTypeOnChangeOptions) => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onChangeNodeProp
当前 document 节点属性修改事件

```typescript
onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions) => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

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