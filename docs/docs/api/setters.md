---
title: setters - 设置器 API
sidebar_position: 6
---
> **@types** [IPublicApiSetters](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/setters.ts)<br/>
> **@since** v1.0.0

## 模块简介
负责注册设置器、管理设置器的 API。注册自定义设置器之后可以在物料中进行使用。

## 方法
### getSetter
获取指定 setter

```typescript
/**
 * 获取指定 setter
 * get setter by type
 * @param type
 * @returns
 */
getSetter(type: string): IPublicTypeRegisteredSetter | null;
```
相关类型：[IPublicTypeRegisteredSetter](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/registerd-setter.ts)

### getSettersMap
获取已注册的所有 settersMap

```typescript
/**
 * 获取已注册的所有 settersMap
 * get map of all registered setters
 * @returns
 */
getSettersMap(): Map<string, IPublicTypeRegisteredSetter & {
  type: string;
}>;
```

相关类型：[IPublicTypeRegisteredSetter](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/registerd-setter.ts)

### registerSetter
注册一个 setter

```typescript
/**
 * 注册一个 setter
 * register a setter
 * @param typeOrMaps
 * @param setter
 * @returns
 */
registerSetter(
  typeOrMaps: string | { [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter },
  setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter | undefined
): void;
```

相关类型：
- [IPublicTypeRegisteredSetter](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/registerd-setter.ts)
- [IPublicTypeCustomView](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/custom-view.ts)

## 使用示例
### 注册官方内置 Setter 到设计器中
```typescript
import { setters, skeleton } from '@alilc/lowcode-engine';
import { setterMap, pluginMap } from '@alilc/lowcode-engine-ext';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const SetterRegistry = (ctx: IPublicModelPluginContext) => {
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

SetterRegistry.pluginName = 'SetterRegistry';
await plugins.register(SetterRegistry);
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
import { setters } from '@alilc/lowcode-engine';
const { registerSetter } = setters;
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
