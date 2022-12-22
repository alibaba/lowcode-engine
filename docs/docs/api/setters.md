---
title: setters - 设置器 API
sidebar_position: 6
---
## 模块简介
负责注册设置器、管理设置器的 API。注册自定义设置器之后可以在物料中进行使用。

## 方法签名（functions）
### getSetter
获取指定 setter

**类型定义**
```typescript
function getSetter(type: string): RegisteredSetter;
```

### getSettersMap
获取已注册的所有 settersMap

**类型定义**
```typescript
function getSettersMap(): Map<string, RegisteredSetter>
```

### registerSetter
注册一个 setter

**类型定义**
```typescript
function registerSetter(
  typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
  setter?: CustomView | RegisteredSetter | undefined,
): void;
```

## 使用示例
### 注册官方内置 Setter 到设计器中
```typescript
import { setters, skeleton } from '@alilc/lowcode-engine';
import { setterMap, pluginMap } from '@alilc/lowcode-engine-ext';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const setterRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    name: 'ext-setters-registry',
    async init() {
      // 注册 setterMap
      setters.registerSetter(setterMap);
      // 注册插件
      // 注册事件绑定面板
      skeleton.add({
        area: 'centerArea',
        type: 'Widget',
        content: pluginMap.EventBindDialog,
        name: 'eventBindDialog',
        props: {},
      });

      // 注册变量绑定面板
      skeleton.add({
        area: 'centerArea',
        type: 'Widget',
        content: pluginMap.VariableBindDialog,
        name: 'variableBindDialog',
        props: {},
      });
    },
  };
}

setterRegistry.pluginName = 'setterRegistry';
await plugins.register(setterRegistry);
```

### 开发自定义 Setter
AltStringSetter 代码如下：
```typescript
import * as React from "react";
import { Input } from "@alifd/next";

import "./index.scss";
interface AltStringSetterProps {
  // 当前值
  value: string;
  // 默认值
  initialValue: string;
  // setter 唯一输出
  onChange: (val: string) => void;
  // AltStringSetter 特殊配置
  placeholder: string;
}
export default class AltStringSetter extends React.PureComponent<AltStringSetterProps> {
  componentDidMount() {
    const { onChange, value, defaultValue } = this.props;
    if (value == undefined && defaultValue) {
      onChange(defaultValue);
    }
  }

  // 声明 Setter 的 title
 	static displayName = 'AltStringSetter';

  render() {
    const { onChange, value, placeholder } = this.props;
    return (
      <Input
        value={value}
        placeholder={placeholder || ""}
        onChange={(val: any) => onChange(val)}
      ></Input>
    );
  }
}
```
开发完毕之后，注册 AltStringSetter 到设计器中：
```typescript
import AltStringSetter from './AltStringSetter';
const registerSetter = window.AliLowCodeEngine.setters.registerSetter;
registerSetter('AltStringSetter', AltStringSetter);
```
注册之后，我们就可以在物料中使用了，其中核心配置如下：
```typescript
{
  "props": {
    "isExtends": true,
    "override": [
      {
        "name": "type",
        "setter": "AltStringSetter"
      }
    ]
  }
}
```
完整配置如下：
```typescript
{
  "componentName": "Message",
  "title": "Message",
  "props": [
    {
      "name": "title",
      "propType": "string",
      "description": "标题",
      "defaultValue": "标题"
    },
    {
      "name": "type",
      "propType": {
        "type": "oneOf",
        "value": [
          "success",
          "warning",
          "error",
          "notice",
          "help",
          "loading"
        ]
      },
      "description": "反馈类型",
      "defaultValue": "success"
    }
  ],
  "configure": {
    "props": {
      "isExtends": true,
      "override": [
        {
          "name": "type",
          "setter": "AltStringSetter"
        }
      ]
    }
  }
}
```
## 模块简介
负责注册设置器、管理设置器的 API。注册自定义设置器之后可以在物料中进行使用。

## 方法签名（functions）
### getSetter
获取指定 setter

**类型定义**
```typescript
function getSetter(type: string): RegisteredSetter;
```

### getSettersMap
获取已注册的所有 settersMap

**类型定义**
```typescript
function getSettersMap(): Map<string, RegisteredSetter>
```

### registerSetter
注册一个 setter

**类型定义**
```typescript
function registerSetter(
  typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
  setter?: CustomView | RegisteredSetter | undefined,
): void;
```

## 使用示例
### 注册官方内置 Setter 到设计器中
```typescript
import { setters, skeleton } from '@alilc/lowcode-engine';
import { setterMap, pluginMap } from '@alilc/lowcode-engine-ext';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const setterRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    name: 'ext-setters-registry',
    async init() {
      // 注册 setterMap
      setters.registerSetter(setterMap);
      // 注册插件
      // 注册事件绑定面板
      skeleton.add({
        area: 'centerArea',
        type: 'Widget',
        content: pluginMap.EventBindDialog,
        name: 'eventBindDialog',
        props: {},
      });

      // 注册变量绑定面板
      skeleton.add({
        area: 'centerArea',
        type: 'Widget',
        content: pluginMap.VariableBindDialog,
        name: 'variableBindDialog',
        props: {},
      });
    },
  };
}

setterRegistry.pluginName = 'setterRegistry';
await plugins.register(setterRegistry);
```

### 开发自定义 Setter
AltStringSetter 代码如下：
```typescript
import * as React from "react";
import { Input } from "@alifd/next";

import "./index.scss";
interface AltStringSetterProps {
  // 当前值
  value: string;
  // 默认值
  initialValue: string;
  // setter 唯一输出
  onChange: (val: string) => void;
  // AltStringSetter 特殊配置
  placeholder: string;
}
export default class AltStringSetter extends React.PureComponent<AltStringSetterProps> {
  componentDidMount() {
    const { onChange, value, defaultValue } = this.props;
    if (value == undefined && defaultValue) {
      onChange(defaultValue);
    }
  }

  // 声明 Setter 的 title
 	static displayName = 'AltStringSetter';

  render() {
    const { onChange, value, placeholder } = this.props;
    return (
      <Input
        value={value}
        placeholder={placeholder || ""}
        onChange={(val: any) => onChange(val)}
      ></Input>
    );
  }
}
```
开发完毕之后，注册 AltStringSetter 到设计器中：
```typescript
import AltStringSetter from './AltStringSetter';
const registerSetter = window.AliLowCodeEngine.setters.registerSetter;
registerSetter('AltStringSetter', AltStringSetter);
```
注册之后，我们就可以在物料中使用了，其中核心配置如下：
```typescript
{
  "props": {
    "isExtends": true,
    "override": [
      {
        "name": "type",
        "setter": "AltStringSetter"
      }
    ]
  }
}
```
完整配置如下：
```typescript
{
  "componentName": "Message",
  "title": "Message",
  "props": [
    {
      "name": "title",
      "propType": "string",
      "description": "标题",
      "defaultValue": "标题"
    },
    {
      "name": "type",
      "propType": {
        "type": "oneOf",
        "value": [
          "success",
          "warning",
          "error",
          "notice",
          "help",
          "loading"
        ]
      },
      "description": "反馈类型",
      "defaultValue": "success"
    }
  ],
  "configure": {
    "props": {
      "isExtends": true,
      "override": [
        {
          "name": "type",
          "setter": "AltStringSetter"
        }
      ]
    }
  }
}
```
