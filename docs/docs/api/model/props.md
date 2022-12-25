---
title: Props
sidebar_position: 4
---
> **@types** [IPublicModelProps](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/props.ts)<br/>
> **@since** v1.0.0

## 基本介绍

属性集模型

## 变量
### id

id
### path

返回当前 props 的路径
### node

返回当前属性集所属的节点实例

## 方法签名
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

### setPropValue

setPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值

### setExtraPropValue

setExtraPropValue(path: string, value: CompositeValue)

设置指定 path 的属性模型实例值