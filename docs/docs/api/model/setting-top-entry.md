---
title: SettingTopEntry
sidebar_position: 6
---
> **@types** [IPublicModelSettingTopEntry](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-top-entry.ts)<br/>

# 基本介绍

setter 设置器顶层操作对象

# 属性

## node

返回所属的节点实例

`@type {IPublicModelNode | null}`

# 方法

## get

获取子级属性对象

```
/**
  * 获取子级属性对象
  * @param propName
  * @returns
  */
get(propName: string | number): IPublicModelSettingField | null;
```
相关章节：[设置器操作对象](./setting-field)

相关类型：[IPublicModelSettingField](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-field.ts)


## getPropValue

获取指定 propName 的值

```
/**
  * 获取指定 propName 的值
  * @param propName
  * @returns
  */
getPropValue(propName: string | number): any;
```

## setPropValue

设置指定 propName 的值

```
/**
  * 设置指定 propName 的值
  * @param propName
  * @param value
  */
setPropValue(propName: string | number, value: any): void;
```

## clearPropValue

清除指定 propName 的值

```
/**
  * 清除指定 propName 的值
  * @param propName
  */
clearPropValue(propName: string | number): void;
```