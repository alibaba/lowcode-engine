---
title: Node
sidebar_position: 1
---
> **@types** [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)<br/>
> **@since** v1.0.0

## 基本介绍

节点模型

## 变量
### id

节点 id

### title

节点标题

### isContainer

是否为「容器型」节点

### isRoot

是否为根节点

### isEmpty

是否为空节点（无 children 或者 children 为空）

### isPage

是否为 Page 节点

### isComponent

是否为 Component 节点

### isModal

是否为「模态框」节点

### isSlot

是否为插槽节点

### isParental

是否为父类/分支节点

### isLeaf
是否为叶子节点

### isLocked
获取当前节点的锁定状态

**@since v1.0.16**

### isRGLContainer
设置为磁贴布局节点，使用方式可参考：[磁贴布局在钉钉宜搭报表设计引擎中的实现](https://mp.weixin.qq.com/s/PSTut5ahAB8nlJ9kBpBaxw)

**@since v1.0.16**

### index

下标

### icon

图标

### zLevel

节点所在树的层级深度，根节点深度为 0

### componentName

节点 componentName

### componentMeta

节点的物料元数据，参见 物料元数据

### document

获取节点所属的[文档模型](./document-model)对象

### prevSibling

获取当前节点的前一个兄弟节点

### nextSibling

获取当前节点的后一个兄弟节点

### parent

获取当前节点的父亲节点

### children

获取当前节点的孩子节点模型

### slots

节点上挂载的插槽节点们

### slotFor

当前节点为插槽节点时，返回节点对应的属性实例

### props

返回节点的属性集

### propsData

返回节点的属性集值

## 方法签名
### getDOMNode

getDOMNode()

获取节点实例对应的 dom 节点

### getRect

getRect()

返回节点的尺寸、位置信息

### hasSlots

hasSlots()

是否有挂载插槽节点

### hasCondition

hasCondition()

是否设定了渲染条件

### hasLoop

hasLoop()

是否设定了循环数据

### getProp

getProp(path: string): Prop | null

获取指定 path 的属性模型实例

### getPropValue

getPropValue(path: string)

获取指定 path 的属性模型实例值

### getExtraProp

getExtraProp(path: string): Prop | null

获取指定 path 的属性模型实例，注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级

### getExtraPropValue

getExtraPropValue(path: string)

获取指定 path 的属性模型实例，注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级

### setPropValue

setPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值

### setExtraPropValue

setExtraPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值

### importSchema

importSchema(data: NodeSchema)

导入节点数据

### exportSchema

exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render, options?: any)

导出节点数据

### insertBefore

insertBefore(node: Node, ref?: Node | undefined, useMutator?: boolean)

在指定位置之前插入一个节点

### insertAfter

insertAfter(node: Node, ref?: Node | undefined, useMutator?: boolean)

在指定位置之后插入一个节点

### replaceChild

replaceChild(node: Node, data: any)

替换指定节点

### replaceWith

replaceWith(schema: NodeSchema)

将当前节点替换成指定节点描述

### select

select()

选中当前节点实例

### hover

hover(flag = true)

设置悬停态

### lock
设置节点锁定状态

```typescript
function lock(flag?: boolean){}
```

**@since v1.0.16**

### remove

remove()

删除当前节点实例