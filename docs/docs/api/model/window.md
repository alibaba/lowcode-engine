---
title: Window
sidebar_position: 12
---

> **@types** [IPublicModelWindow](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/window.ts)<br/>
> **@since** v1.1.0


## 基本介绍

低代码设计器窗口模型

## 方法签名

### importSchema(schema: IPublicTypeNodeSchema)
当前窗口导入 schema

相关类型：[IPublicTypeNodeSchema](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/node-schema.ts)

### changeViewType(viewName: string)
修改当前窗口视图类型

### async save()
调用当前窗口视图保存钩子
