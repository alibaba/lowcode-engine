---
title: NodeChildren
sidebar_position: 2
---
> **@types** [IPublicModelNodeChildren](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node-children.ts)<br/>
> **@since** v1.0.0

## 基本介绍
节点孩子模型

## 变量
### owner

返回当前 children 实例所属的节点实例

### size

children 内的节点实例数

### isEmpty

是否为空

## 方法签名
### delete

delete(node: Node)

删除指定节点

### insert

insert(node: Node, at?: number | null)

插入一个节点

### indexOf

indexOf(node: Node)

返回指定节点的下标

### splice

splice(start: number, deleteCount: number, node?: Node)

类似数组 splice 操作

### get

get(index: number)

返回指定下标的节点

### has

has(node: Node)

是否包含指定节点

### forEach

forEach(fn: (node: Node, index: number) => void)

类似数组的 forEach

### map

map<T\>(fn: (node: Node, index: number) => T[])

类似数组的 map

### every

every(fn: (node: Node, index: number) => boolean)

类似数组的 every

### some

some(fn: (node: Node, index: number) => boolean)

类似数组的 some

### filter

filter(fn: (node: Node, index: number) => boolean)

类似数组的 filter

### find

find(fn: (node: Node, index: number) => boolean)

类似数组的 find

### reduce

reduce(fn: (acc: any, cur: Node) => any, initialValue: any)

类似数组的 reduce

### importSchema

importSchema(data?: NodeData | NodeData[])

导入 schema

### exportSchema

exportSchema(stage: IPulicEnumTransformStage = IPulicEnumTransformStage.Render)

导出 schema

### mergeChildren

mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => any,
    sorter: (firstNode: Node, secondNode: Node) => number,
  )

执行新增、删除、排序等操作