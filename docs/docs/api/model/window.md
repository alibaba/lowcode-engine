---
title: Window
sidebar_position: 12
---

> **[@experimental](./#experimental)**<br/>
> **@types** [IPublicModelWindow](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/window.ts)<br/>
> **@since** v1.1.0


## 基本介绍

低代码设计器窗口模型

## 属性

### id

窗口唯一 id

`@type {string}`

### title

窗口标题

`@type {string}`

### icon

`@type {ReactElement}`

### resource

窗口对应资源

`@type {IPublicModelResource}`

关联模型 [IPublicModelResource](./resource)

### currentEditorView
窗口当前视图

`@type {IPublicModelEditorView}`

关联模型 [IPublicModelEditorView](./editor-view)

### editorViews

窗口所有视图

`@type {IPublicModelEditorView[]}`

关联模型 [IPublicModelEditorView](./editor-view)


## 方法

### importSchema
当前窗口导入 schema, 会调用当前窗口对应资源的 import 钩子

```typescript
function importSchema(schema: IPublicTypeNodeSchema): void
```

相关类型：[IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

### changeViewType
修改当前窗口视图类型

```typescript
function changeViewType(viewName: string): void
```

### save
当前窗口的保存方法，会调用当前窗口对应资源的 save 钩子

```typescript
function save(): Promise(void)
```

## 事件

### onChangeViewType

窗口视图变更事件

```
onChangeViewType(fn: (viewName: string) => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)
