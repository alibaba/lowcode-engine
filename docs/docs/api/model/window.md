---
title: Window
sidebar_position: 12
---

> **@types** [IPublicModelWindow](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/window.ts)<br/>
> **@since** v1.1.0


## 基本介绍

低代码设计器窗口模型

## 变量

### id

窗口唯一 id

### title

窗口标题

### resourceName

窗口资源名字

## 方法签名

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