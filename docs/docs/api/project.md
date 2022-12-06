---
title: project - 模型 API
sidebar_position: 3
---
# 模块简介
引擎编排模块中包含多种模型，包括[项目模型（project）](#DADnF)、[文档模型（document-model）](#lp7xO)、[节点模型（node）](#m0cJS)、[节点孩子模型（node-children）](#W8seq)、[属性集模型（props）](#IJeRY)以及[属性模型（prop）](#w1diM)。
他们的依赖关系如下图：
![image.png](https://cdn.nlark.com/yuque/0/2022/png/110793/1645510146964-62f26151-e624-48f6-a422-dacdcb60dbea.png#averageHue=%23fefefe&clientId=ue969b413-090d-4&crop=0&crop=0&crop=1&crop=1&errorMessage=unknown%20error&from=paste&height=676&id=ucd07aeff&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1352&originWidth=1650&originalType=binary&ratio=1&rotation=0&showTitle=false&size=282048&status=error&style=none&taskId=u8ec0cad1-ed80-46f5-8b6b-b7278b4bb7d&title=&width=825)
在文档模型内部，又有一些引申模型，比如[历史操作（history）](#xvIKj)、[画布节点选中（selection）](#GtFkP)、[画布节点悬停（detecting）](#Tjt05)等。

整个模型系统，以项目模型为最顶层的模型，其他模型实例均需要通过 project 来获得，比如 project.currentDocument 来获取当前的文档模型，project.currentDocument.nodesMap 来获取当前文档模型里所有的节点列表。

# 项目模型（Project）
## 变量（variables）
### currentDocument

获取当前的 document 实例
### documents

获取当前 project 下所有 documents
### simulatorHost

获取模拟器的 host
##
## 方法签名（functions）
### openDocument

openDocument(doc?: string | RootSchema | undefined)

打开一个 document

### createDocument

createDocument(data?: RootSchema): DocumentModel | null

创建一个 document
###
### removeDocument

removeDocument(doc: DocumentModel)

删除一个 document

### getDocumentByFileName

getDocumentByFileName(fileName: string): DocumentModel | null

根据 fileName 获取 document

### getDocumentById

getDocumentById(id: string): DocumentModel | null

根据 id 获取 document

### exportSchema

exportSchema()

导出 project

### importSchema

importSchema(schema?: ProjectSchema)

导入 project

### getCurrentDocument

getCurrentDocument(): DocumentModel | null

获取当前的 document

### addPropsTransducer

addPropsTransducer(transducer: PropsTransducer, stage: TransformStage)

增加一个属性的管道处理函数

**示例 1：在保存的时候删除每一个组件的 props.hidden**
```typescript
import { ILowCodePluginContext, project } from '@alilc/lowcode-engine';
import { CompositeObject, TransformStage } from '@alilc/lowcode-types';

export const deleteHiddenTransducer = (ctx: ILowCodePluginContext) => {
  return {
    name: 'deleteHiddenTransducer',
    async init() {
      project.addPropsTransducer((props: CompositeObject): CompositeObject => {
        delete props.hidden;
        return props;
      }, TransformStage.Save);
    },
  };
}

deleteHiddenTransducer.pluginName = 'deleteHiddenTransducer';
```

### onRemoveDocument
绑定删除文档事件
```typescript
function onRemoveDocument(fn: (data: { docId: string}) => void) {}
```
*引擎版本>=1.0.16
### setI18n
设置多语言语料
```typescript
function setI18n(value: object) {}
```
*引擎版本>=1.0.17
## 事件（events）
### onChangeDocument

onChangeDocument(fn: (doc: DocumentModel) => void)

当前 project 内的 document 变更事件

### onSimulatorHostReady

onSimulatorHostReady(fn: (host: SimulatorHost) => void)

当前 project 的模拟器 ready 事件

### onSimulatorRendererReady

onSimulatorRendererReady(fn: () => void)

当前 project 的渲染器 ready 事件
#
# 文档模型（DocumentModel）
## 变量（variables）
### selection

画布节点选中区模型实例，具体方法参见 [画布节点选中区模型](#GtFkP)

### detecting

画布节点 hover 区模型实例，具体方法参见 [画布节点 hover 区模型](#Tjt05)

### history

操作历史模型实例，具体方法参见 [操作历史模型](#xvIKj)
### canvas

获取当前画布中的一些信息，比如拖拽时的 dropLocation

### project

获取当前文档模型所属的 project

### root

获取文档的根节点

### nodesMap

获取文档下所有节点

### modalNodesManager

参见 [模态节点管理](#nNRF9)

## 方法签名（functions）
### getNodeById

getNodeById(nodeId: string)

根据 nodeId 返回 [Node](#m0cJS) 实例

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
*引擎版本 > 1.0.16
```typescript
function checkNesting(dropTarget: Node, dragObject: DragNodeObject | DragNodeDataObject): boolean {}
```
##
## 事件（events）
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
onChangeNodeProp(fn: (info: PropChangeOptions) => void)
```

### onImportSchema
当前 document 导入新的 schema 事件
版本 >= 1.0.15
```typescript
onImportSchema(fn: (schema: any) => void)
```

# 画布节点选中模型（Selection）
## 变量（variables）
### selected

返回选中的节点 id

## 方法签名（functions）
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

*引擎版本 >= 1.0.16


# 画布节点悬停模型（Detecting）
## 方法签名（functions）
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
*引擎版本 >= 1.0.16

# 操作历史记录模型（History）
## 方法签名（functions）
### go

go(cursor: number)

历史记录跳转到指定位置

### back

back()

历史记录后退

### forward

forward()

历史记录前进
### savePoint

savePoint()

保存当前状态
### isSavePoint

isSavePoint()

当前是否是「保存点」，即是否有状态变更但未保存

### getState

getState()

获取 state，判断当前是否为「可回退」、「可前进」的状态

## 事件（events）
### onChangeState

onChangeState(func: () => any)

监听 state 变更事件

### onChangeCursor

onChangeCursor(func: () => any)

监听历史记录游标位置变更事件

# 节点模型（Node）
## 变量（variables）
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
*引擎版本>=1.0.16

### isRGLContainer
设置为磁贴布局节点，使用方式可参考：[磁贴布局在钉钉宜搭报表设计引擎中的实现](https://mp.weixin.qq.com/s/PSTut5ahAB8nlJ9kBpBaxw)
*引擎版本>=1.0.16

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

获取节点所属的[文档模型](#lp7xO)对象

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

## 方法签名（functions）
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

exportSchema(stage: TransformStage = TransformStage.Render, options?: any)

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
*引擎版本>=1.0.16

### remove

remove()

删除当前节点实例

# 节点孩子模型（NodeChildren）
## 变量（variables）
### owner

返回当前 children 实例所属的节点实例

### size

children 内的节点实例数

### isEmpty

是否为空

## 方法签名（functions）
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

exportSchema(stage: TransformStage = TransformStage.Render)

导出 schema

### mergeChildren

mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => any,
    sorter: (firstNode: Node, secondNode: Node) => number,
  )

执行新增、删除、排序等操作

# 属性集模型（Props）
## 变量（variables）
### id

id
### path

返回当前 props 的路径
### node

返回当前属性集所属的节点实例

## 方法签名（functions）
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

获取指定 path 的属性模型实例值，注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
###

### setPropValue

setPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值

### setExtraPropValue

setExtraPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值

# 属性模型（Prop）
## 变量（variables）
### id

id

### key

key 值

### path

返回当前 prop 的路径

### node

返回所属的节点实例

## 方法签名（functions）
### setValue

setValue(val: CompositeValue)

设置值

### getValue

getValue()

获取值

### remove
移除值
*引擎版本>=1.0.16

### exportSchema

exportSchema(stage: TransformStage = TransformStage.Render)

导出值

# 模态节点管理模型（ModalNodesManager）
## 方法签名（functions）
### getModalNodes

getModalNodes()

获取模态节点（们）

### getVisibleModalNode

getVisibleModalNode()

获取当前可见的模态节点

### hideModalNodes

hideModalNodes()

隐藏模态节点（们）

### setVisible

setVisible(node: Node)

设置指定节点为可见态

### setInvisible

setInvisible(node: Node)

设置指定节点为不可见态

### setNodes

setNodes()

设置模态节点，触发内部事件
