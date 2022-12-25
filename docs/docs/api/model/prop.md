---
title: Prop
sidebar_position: 3
---
> **@types** [IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)<br/>
> **@since** v1.0.0

## 基本介绍

属性模型

## 变量

### id

id

### key

key 值

### path

返回当前 prop 的路径

### node

返回所属的节点实例

## 方法签名

### setValue

setValue(val: CompositeValue)

设置值

### getValue

getValue()

获取值

### remove
移除值

**@since v1.0.16**

### exportSchema

exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render)

导出值