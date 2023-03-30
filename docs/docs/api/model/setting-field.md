---
title: SettingField
sidebar_position: 6
---
> **@types** [IPublicModelSettingField](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-field.ts)<br/>

## 基本介绍

setter 设置器操作对象

## 属性

#### isGroup

获取设置属性的 isGroup

`@type {boolean}`


#### id

获取设置属性的 id

`@type {string}`

#### name

获取设置属性的 name

`@type {string | number | undefined}`

#### key

获取设置属性的 key

`@type {string | number | undefined}`

#### path

获取设置属性的 path

`@type {(string | number)[]}`

#### title

获取设置属性的 title

`@type {string}`

#### setter

获取设置属性的 setter

`@type {IPublicTypeSetterType | null}`

#### expanded

获取设置属性的 expanded

`@type {boolean}`

#### extraProps

获取设置属性的 extraProps

`@type {IPublicTypeFieldExtraProps}`

#### props

`@type {IPublicModelSettingTopEntry}`

相关章节：[设置器顶层操作对象](./setting-top-entry)

相关类型：[IPublicModelSettingTopEntry](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-top-entry.ts)

#### node

获取设置属性对应的节点实例

`@type {IPublicModelNode | null}`


#### parent

获取设置属性的父设置属性

`@type {IPublicModelSettingTopEntry | IPublicModelSettingField}`

相关章节：[设置器顶层操作对象](./setting-top-entry)

相关类型：[IPublicModelSettingTopEntry](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-top-entry.ts)

#### top

获取顶级设置属性

`@type {IPublicModelSettingTopEntry}`

相关章节：[设置器顶层操作对象](./setting-top-entry)

相关类型：[IPublicModelSettingTopEntry](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-top-entry.ts)

#### isSettingField

是否是 SettingField 实例

`@type {boolean}`

#### componentMeta

`@type {IPublicModelComponentMeta}`

相关类型：[IPublicModelComponentMeta](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/component-meta.ts)

#### items

获取设置属性的 items

`@type {Array<IPublicModelSettingField | IPublicTypeCustomView>}`

相关类型：[IPublicTypeCustomView](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/custom-view.ts)

## 方法

#### setKey

设置 key 值

```
/**
  * 设置 key 值
  * @param key
  */
setKey(key: string | number): void;
```

#### setValue

设置值

```
/**
  * 设置值
  * @param val 值
  */
setValue(val: IPublicTypeCompositeValue, extraOptions?: IPublicTypeSetValueOptions): void;
```

相关类型：
- [IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)
- [IPublicTypeSetValueOptions](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/set-value-options.ts)

#### setPropValue

设置子级属性值

```
/**
  * 设置子级属性值
  * @param propName 子属性名
  * @param value 值
  */
setPropValue(propName: string | number, value: any): void;
```

#### clearPropValue

清空指定属性值

```
/**
  * 清空指定属性值
  * @param propName
  */
clearPropValue(propName: string | number): void;
```

#### getDefaultValue

获取配置的默认值

```
/**
  * 获取配置的默认值
  * @returns
  */
getDefaultValue(): any;
```

#### getValue

获取值

```
/**
  * 获取值
  * @returns
  */
getValue(): any;
```

#### getPropValue

获取子级属性值

```
/**
  * 获取子级属性值
  * @param propName 子属性名
  * @returns
  */
getPropValue(propName: string | number): any;
```

#### getExtraPropValue

获取顶层附属属性值

```
/**
  * 获取顶层附属属性值
  */
getExtraPropValue(propName: string): any;
```

#### setExtraPropValue

设置顶层附属属性值

```
/**
  * 设置顶层附属属性值
  */
setExtraPropValue(propName: string, value: any): void;
```

#### getProps

获取设置属性集

```
/**
  * 获取设置属性集
  * @returns
  */
getProps(): IPublicModelSettingTopEntry;
```

相关章节：[设置器顶层操作对象](./setting-top-entry)

相关类型：[IPublicModelSettingTopEntry](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/setting-top-entry.ts)

#### isUseVariable

是否绑定了变量

```
/**
  * 是否绑定了变量
  * @returns
  */
isUseVariable(): boolean;
```

#### setUseVariable

设置绑定变量

```
/**
  * 设置绑定变量
  * @param flag
  */
setUseVariable(flag: boolean): void;
```

#### createField

创建一个设置 field 实例

```
/**
  * 创建一个设置 field 实例
  * @param config
  * @returns
  */
createField(config: IPublicTypeFieldConfig): IPublicModelSettingField;
```

相关类型：[IPublicTypeFieldConfig](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/field-config.ts)

#### getMockOrValue

获取值，当为变量时，返回 mock

```
/**
  * 获取值，当为变量时，返回 mock
  * @returns
  */
getMockOrValue(): any;

```

#### purge

销毁当前 field 实例

```
/**
  * 销毁当前 field 实例
  */
purge(): void;
```

#### remove

移除当前 field 实例

```
/**
  * 移除当前 field 实例
  */
remove(): void;
```

## 事件

#### onEffect

设置 autorun

```
/**
  * 设置 autorun
  * @param action
  * @returns
  */
onEffect(action: () => void): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)