---
title: plugins - 插件 API
sidebar_position: 2
---
> **@types** [IPublicApiPlugins](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/plugins.ts)<br/>
> **@since** v1.0.0

## 模块简介
插件管理器，提供编排模块中管理插件的能力。

## 方法
### register
注册插件

```typescript
async function register(
  plugin: IPublicTypePlugin,
  options?: IPublicTypePluginRegisterOptions,
): Promise<void>
```
相关 types:
- [IPublicTypePlugin](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/plugin.ts)
- [IPublicTypePluginRegisterOptions](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/plugin-register-options.ts)

其中第一个参数 plugin 通过低代码工具链的插件脚手架生成编写模板，开发者可以参考[这个章节](/site/docs/guide/expand/editor/cli)进行创建


#### 简单示例
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const builtinPluginRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton } = ctx;

      // 注册组件面板
      const componentsPane = skeleton.add({
        area: 'leftArea',
        type: 'PanelDock',
        name: 'componentsPane',
        content: ComponentsPane,
        contentProps: {},
        props: {
          align: 'top',
          icon: 'zujianku',
          description: '组件库',
        },
      });
      componentsPane?.disable?.();
      project.onSimulatorRendererReady(() => {
        componentsPane?.enable?.();
      })
    },
  };
}
builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
await plugins.register(builtinPluginRegistry);
```
#### 使用 exports 示例
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const PluginA = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {},
    exports() { return { x: 1, } },
  };
}
PluginA.pluginName = 'PluginA';

const PluginB = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      // 获取 pluginA 的导出值
      console.log(ctx.plugins.PluginA.x); // => 1
    },
  };
}
PluginA.pluginName = 'pluginA';
PluginB.pluginName = 'PluginB';
PluginB.meta = {
  dependencies: ['PluginA'],
}
await plugins.register(PluginA);
await plugins.register(PluginB);
```
> 注：ctx 是在插件中获取引擎 API 的唯一渠道，具体定义参见 [IPublicModelPluginContext](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/plugin-context.ts)


#### 设置兼容引擎版本示例
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const BuiltinPluginRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      ...
    },
  };
}
BuiltinPluginRegistry.pluginName = 'BuiltinPluginRegistry';
BuiltinPluginRegistry.meta = {
  engines: {
    lowcodeEngine: '^1.0.0', // 插件需要配合 ^1.0.0 的引擎才可运行
  },
}
await plugins.register(BuiltinPluginRegistry);
```
#### 设置插件参数版本示例
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const BuiltinPluginRegistry = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      // 直接传值方式：
      //   通过 register(xxx, options) 传入
      //   通过 options 取出

      // 引擎初始化时也可以设置某插件的全局配置项：
      //   通过 engine.init(..., preference) 传入
      //   通过 ctx.preference.getValue() 取出
    },
  };
}
BuiltinPluginRegistry.pluginName = 'BuiltinPluginRegistry';
BuiltinPluginRegistry.meta = {
  preferenceDeclaration: {
    title: 'pluginA 的参数定义',
    properties: [
      {
        key: 'key1',
        type: 'string',
        description: 'this is description for key1',
      },
      {
        key: 'key2',
        type: 'boolean',
        description: 'this is description for key2',
      },
      {
        key: 'key3',
        type: 'number',
        description: 'this is description for key3',
      },
      {
        key: 'key4',
        type: 'string',
        description: 'this is description for key4',
      },
    ],
  },
}

await plugins.register(BuiltinPluginRegistry, { key1: 'abc', key5: 'willNotPassToPlugin' });
```

### get

获取指定插件

```typescript
/**
 * 获取指定插件
 * get plugin instance by name
 */
get(pluginName: string): IPublicModelPluginInstance | null;
```

关联模型 [IPublicModelPluginInstance](./model/plugin-instance)

### getAll

获取所有的插件实例

```typescript
/**
 * 获取所有的插件实例
 * get all plugin instances
 */
getAll(): IPublicModelPluginInstance[];
```

关联模型 [IPublicModelPluginInstance](./model/plugin-instance)

### has

判断是否有指定插件

```typescript
/**
 * 判断是否有指定插件
 * check if plugin with certain name exists
 */
has(pluginName: string): boolean;
```

### delete

删除指定插件

```typescript
/**
 * 删除指定插件
 * delete plugin instance by name
 */
delete(pluginName: string): void;
```

### getPluginPreference

引擎初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置

```typescript
/**
 * 引擎初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置
 * use this to get preference config for this plugin when engine.init() called
 */
getPluginPreference(
    pluginName: string,
  ): Record<string, IPublicTypePluginPreferenceValueType> | null | undefined;
```

## 相关类型定义

- [IPublicModelPluginContext](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/plugin-context.ts)
- [IPublicTypePluginConfig](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/plugin-config.ts)
- [IPublicModelPluginInstance](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/plugin-instance.ts)

## 插件元数据工程转化示例
your-plugin/package.json
```json
{
	"name": "@alilc/lowcode-plugin-debug",
  "lcMeta": {
    "pluginName": "debug",
    "meta": {
      "engines": {
        "lowcodeEgnine": "^1.0.0"
      },
      "preferenceDeclaration": { ... }
    }
  }
}
```
转换后的结构：
```typescript
const debug = (ctx: IPublicModelPluginContext, options: any) => {
	return {};
}

debug.pluginName = 'debug';
debug.meta = {
  engines: {
    lowcodeEgnine: '^1.51.0',
	},
  preferenceDeclaration: { ... }
};
```
