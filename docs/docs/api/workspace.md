---
title: workspace - 应用级 API
sidebar_position: 12
---

> **@types** [IPublicApiWorkspace](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/workspace.ts)<br/>
> **@since** v1.1.0


## 模块简介

通过该模块可以开发应用级低代码设计器。

## 变量

### isActive

是否启用 workspace 模式

### window

当前设计器窗口模型

```typescript
get window(): IPublicModelWindow
```

关联模型 [IPublicModelWindow](./model/window)

### plugins

应用级别的插件注册

```typescript
get plugins(): IPublicApiPlugins
```

关联模型 [IPublicApiPlugins](./plugins)

### windows

当前设计器的编辑窗口

```typescript
get window(): IPublicModelWindow[]
```

关联模型 [IPublicModelWindow](./model/window)

## 方法签名

### registerResourceType
注册资源

```typescript
/** 注册资源 */
registerResourceType(resourceName: string, resourceType: 'editor', options: IPublicResourceOptions): void;
```

相关类型：[IPublicResourceOptions](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/resource-options.ts)

### onChangeWindows

窗口新增/删除的事件

```typescript
function onChangeWindows(fn: () => void): void;
```

### onChangeActiveWindow

active 窗口变更事件

```typescript
function onChangeActiveWindow(fn: () => void): void;
```
