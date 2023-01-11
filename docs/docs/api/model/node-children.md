---
title: NodeChildren
sidebar_position: 2
---
> **@types** [IPublicModelNodeChildren](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node-children.ts)<br/>
> **@since** v1.0.0

## 基本介绍
节点孩子模型

## 属性
### owner

返回当前 children 实例所属的节点实例

`@type {IPublicModelNode | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### size

children 内的节点实例数

`@type {number}`


### isEmptyNode

是否为空

`@type {boolean}`

**@since v1.1.0**
> v1.1.0 之前请使用 `isEmpty`

### notEmptyNode

是否不为空

`@type {boolean}`

**@since v1.1.0**

## 方法
### delete
删除指定节点

```typescript
/**
 * 删除指定节点
 * delete the node
 * @param node
 */
delete(node: IPublicModelNode): boolean;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### insert

插入一个节点

```typescript
/**
 * 删除指定节点
 * delete the node
 * @param node
 */
delete(node: IPublicModelNode): boolean;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### indexOf

返回指定节点的下标

```typescript
/**
 * 返回指定节点的下标
 * get index of node in current children
 * @param node
 * @returns
 */
indexOf(node: IPublicModelNode): number;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### splice

类似数组 splice 操作

```typescript
/**
 * 类似数组 splice 操作
 * provide the same function with {Array.prototype.splice}
 * @param start
 * @param deleteCount
 * @param node
 */
splice(start: number, deleteCount: number, node?: IPublicModelNode): any;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### get

返回指定下标的节点

```typescript
/**
 * 返回指定下标的节点
 * get node with index
 * @param index
 * @returns
 */
get(index: number): IPublicModelNode | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### has

是否包含指定节点

```typescript
/**
 * 是否包含指定节点
 * check if node exists in current children
 * @param node
 * @returns
 */
has(node: IPublicModelNode): boolean;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### forEach

类似数组的 forEach

```typescript
/**
 * 类似数组的 forEach
 * provide the same function with {Array.prototype.forEach}
 * @param fn
 */
forEach(fn: (node: IPublicModelNode, index: number) => void): void;

```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### map

类似数组的 map

```typescript
/**
 * 类似数组的 map
 * provide the same function with {Array.prototype.map}
 * @param fn
 */
map<T>(fn: (node: IPublicModelNode, index: number) => T[]): any[] | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### every

类似数组的 every

```typescript
/**
 * 类似数组的 every
 * provide the same function with {Array.prototype.every}
 * @param fn
 */
every(fn: (node: IPublicModelNode, index: number) => boolean): boolean;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### some

类似数组的 some

```typescript
/**
 * 类似数组的 some
 * provide the same function with {Array.prototype.some}
 * @param fn
 */
some(fn: (node: IPublicModelNode, index: number) => boolean): boolean;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### filter

类似数组的 filter

```typescript
/**
 * 类似数组的 filter
 * provide the same function with {Array.prototype.filter}
 * @param fn
 */
filter(fn: (node: IPublicModelNode, index: number) => boolean): any;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### find

类似数组的 find

```typescript
/**
 * 类似数组的 find
 * provide the same function with {Array.prototype.find}
 * @param fn
 */
find(fn: (node: IPublicModelNode, index: number) => boolean): IPublicModelNode | null;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### reduce

类似数组的 reduce

```typescript
/**
 * 类似数组的 reduce
 * provide the same function with {Array.prototype.reduce}
 * @param fn
 */
reduce(fn: (acc: any, cur: IPublicModelNode) => any, initialValue: any): void;
```

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


### importSchema

导入 schema

```typescript
/**
 * 导入 schema
 * import schema
 * @param data
 */
importSchema(data?: IPublicTypeNodeData | IPublicTypeNodeData[]): void;
```

相关类型：[IPublicTypeNodeData](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-data.ts)


### exportSchema
导出 schema

```typescript
/**
 * 导出 schema
 * export schema
 * @param stage
 */
exportSchema(stage: IPublicEnumTransformStage): IPublicTypeNodeSchema;
```

相关类型：
- [IPublicEnumTransformStage](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/enum/transform-stage.ts)
- [IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)


### mergeChildren

执行新增、删除、排序等操作

```typescript
/**
 * 执行新增、删除、排序等操作
 * excute remove/add/sort operations
 * @param remover
 * @param adder
 * @param sorter
 */
mergeChildren(
  remover: (node: IPublicModelNode, idx: number) => boolean,
  adder: (children: IPublicModelNode[]) => IPublicTypeNodeData[] | null,
  sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number
): any;
```

相关类型：
- [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)
- [IPublicTypeNodeData](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-data.ts)
