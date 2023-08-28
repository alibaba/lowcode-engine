---
title: Node
sidebar_position: 1
---
> **@types** [IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)<br/>
> **@since** v1.0.0

## 基本介绍

节点模型

## 属性
### id

节点 id

`@type {string}`

### title

节点标题

`@type {string | IPublicTypeI18nData | ReactElement}`

相关类型：[IPublicTypeI18nData](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/i18n-data.ts)

### isContainerNode

是否为「容器型」节点

`@type {boolean}`

**@since v1.1.0**
> v1.1.0 之前请使用 `isContainer`

### isRootNode

是否为根节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isRoot`

### isEmptyNode

是否为空节点（无 children 或者 children 为空）

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isEmpty`

### isPageNode

是否为 Page 节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isPage`

### isComponentNode

是否为 Component 节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isComponent`

### isModalNode

是否为「模态框」节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isModal`

### isSlotNode

是否为插槽节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isSlot`

### isParentalNode

是否为父类/分支节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isParental`

### isLeafNode

是否为叶子节点

`@type {boolean}`

**@since v1.1.0**

> v1.1.0 之前请使用 `isLeaf`

### isLocked

获取当前节点的锁定状态

**@since v1.0.16**

### isRGLContainerNode
设置为磁贴布局节点，使用方式可参考：[磁贴布局在钉钉宜搭报表设计引擎中的实现](https://mp.weixin.qq.com/s/PSTut5ahAB8nlJ9kBpBaxw)

`@type {boolean}`

**@since v1.1.0**

> v1.0.16 - v1.1.0 请使用 `isRGLContainer`

### index

下标

`@type {number}`

### icon

图标

`@type {IPublicTypeIconType}`

相关类型：[IPublicTypeIconType](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/icon-type.ts)

### zLevel

节点所在树的层级深度，根节点深度为 0

`@type {number}`

### componentName

节点 componentName

`@type {string}`

### componentMeta

节点的物料元数据

`@type {IPublicModelComponentMeta | null}`

相关类型：[IPublicModelComponentMeta](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/component-meta.ts)


### document

获取节点所属的[文档模型](./document-model)对象

`@type {IPublicModelDocumentModel | null}`

相关类型：[IPublicModelDocumentModel](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/document-model.ts)

### prevSibling

获取当前节点的前一个兄弟节点

`@type {IPublicModelNode | null}`

### nextSibling

获取当前节点的后一个兄弟节点

`@type {IPublicModelNode | null}`

### parent

获取当前节点的父亲节点

`@type {IPublicModelNode | null}`

### children

获取当前节点的孩子节点模型

`@type {IPublicModelNodeChildren | null}`

相关类型：[IPublicModelNodeChildren](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node-children.ts)

### slots

节点上挂载的插槽节点们

`@type {IPublicModelNode[]}`

### slotFor

当前节点为插槽节点时，返回节点对应的属性实例

`@type {IPublicModelProp | null}`

相关类型：[IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)

### props

返回节点的属性集

`@type {IPublicModelProps | null}`

相关类型：[IPublicModelProps](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/props.ts)


### propsData

返回节点的属性集值

`@type {IPublicTypePropsMap | IPublicTypePropsList | null}`

相关类型：
- [IPublicTypePropsMap](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/props-map.ts)
- [IPublicTypePropsList](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/props-list.ts)

### conditionGroup

获取条件组

`@type {IPublicModelExclusiveGroup | null}`

相关类型：[IPublicModelExclusiveGroup](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/exclusive-group.ts)

**@since v1.1.0**

### schema

获取符合搭建协议 - 节点 schema 结构

`@type {IPublicTypeNodeSchema | null}`

相关类型：[IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

### settingEntry

获取对应的 setting entry

`@type {IPublicModelSettingTopEntry}`

相关章节：[设置器顶层操作对象](./setting-top-entry)

相关类型：[IPublicModelSettingTopEntry](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-top-entry.ts)

### visible
当前节点是否可见

`@type {boolean}`

**@since v1.1.0**

## 方法

### getRect

返回节点的尺寸、位置信息

```typescript
/**
 * 返回节点的尺寸、位置信息
 * get rect information for this node
 */
getRect(): DOMRect | null;
```

### hasSlots

是否有挂载插槽节点

```typescript
/**
 * 是否有挂载插槽节点
 * check if current node has slots
 */
hasSlots(): boolean;
```

### hasCondition

是否设定了渲染条件

```typescript
/**
 * 是否设定了渲染条件
 * check if current node has condition value set
 */
hasCondition(): boolean;
```

### hasLoop

是否设定了循环数据

```typescript
/**
 * 是否设定了循环数据
 * check if loop is set for this node
 */
hasLoop(): boolean;
```

### getProp

获取指定 path 的属性模型实例

```typescript
/**
 * 获取指定 path 的属性模型实例
 * get prop by path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 */
getProp(path: string, createIfNone: boolean): IPublicModelProp | null;
```

相关类型：[IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)

### getPropValue

获取指定 path 的属性模型实例值

```typescript
/**
 * 获取指定 path 的属性模型实例值
 * get prop value by path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 */
getPropValue(path: string): any;
```

### getExtraProp

获取指定 path 的属性模型实例，注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级

```typescript
/**
 * 获取指定 path 的属性模型实例，
 *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
 *
 * get extra prop by path, an extra prop means a prop not exists in the `props`
 * but as siblint of the `props`
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 * @param createIfNone 当没有属性的时候，是否创建一个属性
 */
getExtraProp(path: string, createIfNone?: boolean): IPublicModelProp | null;
```

相关类型：[IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)

### getExtraPropValue

获取指定 path 的属性模型实例，注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级

```typescript
/**
 * 获取指定 path 的属性模型实例，
 *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
 *
 * get extra prop value by path, an extra prop means a prop not exists in the `props`
 * but as siblint of the `props`
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 * @returns
 */
getExtraPropValue(path: string): any;
```

### setPropValue

setPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值

```typescript
/**
 * 设置指定 path 的属性模型实例值
 * set value for prop with path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 * @param value 值
 */
setPropValue(path: string, value: IPublicTypeCompositeValue): void;
```

相关类型：[IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)


### setExtraPropValue

设置指定 path 的属性模型实例值

```typescript
/**
 * 设置指定 path 的属性模型实例值
 * set value for extra prop with path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 * @param value 值
 */
setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void;
```

相关类型：[IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)

### importSchema

导入节点数据

```typescript
/**
 * 导入节点数据
 * import node schema
 * @param data
 */
importSchema(data: IPublicTypeNodeSchema): void;
```

相关类型：[IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

### exportSchema

导出节点数据

```typescript
/**
 * 导出节点数据
 * export schema from this node
 * @param stage
 * @param options
 */
exportSchema(stage: IPublicEnumTransformStage, options?: any): IPublicTypeNodeSchema;
```

相关类型：
- [IPublicEnumTransformStage](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/enum/transform-stage.ts)
- [IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

### insertBefore

在指定位置之前插入一个节点

```typescript
/**
 * 在指定位置之前插入一个节点
 * insert a node befor current node
 * @param node
 * @param ref
 * @param useMutator
 */
insertBefore(
    node: IPublicModelNode,
    ref?: IPublicModelNode | undefined,
    useMutator?: boolean,
  ): void;
```

### insertAfter

在指定位置之后插入一个节点

```typescript
/**
 * 在指定位置之后插入一个节点
 * insert a node after this node
 * @param node
 * @param ref
 * @param useMutator
 */
insertAfter(
    node: IPublicModelNode,
    ref?: IPublicModelNode | undefined,
    useMutator?: boolean,
  ): void;
```

### replaceChild

替换指定子节点

```typescript
/**
 * 替换指定子节点
 * replace a child node with data provided
 * @param node 待替换的子节点
 * @param data 用作替换的节点对象或者节点描述
 * @returns
 */
replaceChild(node: IPublicModelNode, data: any): IPublicModelNode | null;
```

### replaceWith

将当前节点替换成指定节点描述

```typescript
/**
 * 将当前节点替换成指定节点描述
 * replace current node with a new node schema
 * @param schema
 */
replaceWith(schema: IPublicTypeNodeSchema): any;
```

相关类型：[IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

### select

选中当前节点实例

```typescript
/**
 * 选中当前节点实例
 * select current node
 */
select(): void;
```

### hover

设置悬停态

```typescript
/**
 * 设置悬停态
 * set hover value for current node
 * @param flag
 */
hover(flag: boolean): void;
```

### lock
设置节点锁定状态

```typescript
/**
 * 设置节点锁定状态
 * set lock value for current node
 * @param flag
 * @since v1.0.16
 */
lock(flag?: boolean): void;
```

**@since v1.0.16**

### remove

删除当前节点实例

```typescript
/**
 * 删除当前节点实例
 * remove current node
 */
remove(): void;
```

### mergeChildren

执行新增、删除、排序等操作

```typescript
/**
 * 执行新增、删除、排序等操作
 * excute remove/add/sort operations on node`s children
 *
 * @since v1.1.0
 */
mergeChildren(
  remover: (node: IPublicModelNode, idx: number) => boolean,
  adder: (children: IPublicModelNode[]) => any,
  sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number
): any;
```

**@since v1.1.0**

### contains

当前节点是否包含某子节点

```typescript
/**
 * 当前节点是否包含某子节点
 * check if current node contains another node as a child
 * @param node
 * @since v1.1.0
 */
contains(node: IPublicModelNode): boolean;
```

**@since v1.1.0**

### canPerformAction

是否可执行某 action

```typescript
/**
 * 是否可执行某 action
 * check if current node can perform certain aciton with actionName
 * @param actionName action 名字
 * @since v1.1.0
 */
canPerformAction(actionName: string): boolean;
```

**@since v1.1.0**

### isConditionalVisible

获取该节点的 ConditionalVisible 值

```typescript
/**
 * 获取该节点的 ConditionalVisible 值
 * check if current node ConditionalVisible
 * @since v1.1.0
 */
isConditionalVisible(): boolean | undefined;
```

**@since v1.1.0**

### setConditionalVisible
设置该节点的 ConditionalVisible 为 true

```typescript
/**
 * 设置该节点的 ConditionalVisible 为 true
 * make this node as conditionalVisible === true
 * @since v1.1.0
 */
setConditionalVisible(): void;
```

**@since v1.1.0**

### getDOMNode
获取节点实例对应的 dom 节点

```typescript
/**
 * 获取节点实例对应的 dom 节点
 */
getDOMNode(): HTMLElement;

```

### getRGL

获取磁贴相关信息

```typescript
/**
 * 获取磁贴相关信息
 */
getRGL(): {
  isContainerNode: boolean;
  isEmptyNode: boolean;
  isRGLContainerNode: boolean;
  isRGLNode: boolean;
  isRGL: boolean;
  rglNode: Node | null;
}
```