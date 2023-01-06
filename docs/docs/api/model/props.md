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

`@type {string}`


### path

返回当前 props 的路径

`@type {string[]}`


### node

返回当前属性集所属的节点实例

`@type {IPublicModelNode | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

## 方法签名
### getProp

获取指定 path 的属性模型实例

```typescript
/**
 * 获取指定 path 的属性模型实例
 * get prop by path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 */
getProp(path: string): IPublicModelProp | null;
```

相关类型：[IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)

### getPropValue

获取指定 path 的属性模型实例值

```typescript
/**
 * 获取指定 path 的属性模型实例值
 * get value of prop by path
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
 * get extra prop by path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 */
getExtraProp(path: string): IPublicModelProp | null;
```

相关类型：[IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)

### getExtraPropValue

获取指定 path 的属性模型实例值，注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级

```typescript
/**
 * 获取指定 path 的属性模型实例值
 *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
 * get value of extra prop by path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 */
getExtraPropValue(path: string): any;
```

### setPropValue

设置指定 path 的属性模型实例值

```typescript
/**
 * 设置指定 path 的属性模型实例值
 * set value of prop by path
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
 * set value of extra prop by path
 * @param path 属性路径，支持 a / a.b / a.0 等格式
 * @param value 值
 */
setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void;
```

相关类型：[IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)


### has

当前 props 是否包含某 prop

```typescript
/**
 * 当前 props 是否包含某 prop
 * check if the specified key is existing or not.
 * @param key
 * @since v1.1.0
 */
has(key: string): boolean;
```

**@since v1.1.0**

### add

添加一个 prop

```typescript
/**
 * 添加一个 prop
 * add a key with given value
 * @param value
 * @param key
 * @since v1.1.0
 */
add(value: IPublicTypeCompositeValue, key?: string | number | undefined): any;
```

相关类型：[IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)

**@since v1.1.0**