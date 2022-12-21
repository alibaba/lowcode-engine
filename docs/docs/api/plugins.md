---
title: plugins - 插件 API
sidebar_position: 4
---
## 模块简介
插件管理器，提供编排模块中管理插件的能力。
## 变量（variables）
无
## 方法签名（functions）
### register
注册插件

#### 类型定义
```typescript
async function register(
  pluginConfigCreator: (ctx: IPublicModelPluginContext) => IPublicTypePluginConfig,
  options?: ILowCodeRegisterOptions,
): Promise<void>
```
pluginConfigCreator 是一个 IPublicTypePluginConfig 生成函数，IPublicTypePluginConfig 中包含了该插件的 init / destroy 等钩子函数，以及 exports 函数用于返回插件对外暴露的值。

另外，pluginConfigCreator 还必须挂载 pluginName 字段，全局确保唯一，否则 register 时会报错，可以选择性挂载 meta 字段，用于描述插件的元数据信息，比如兼容的引擎版本、支持的参数配置、依赖插件声明等。
> 注：pluginConfigCreator 挂载 pluginName / meta 可以通过低代码工具链的插件脚手架生成，写如 package.json 后将会自动注入到代码中，具体见 [插件元数据工程化示例](#RO9YY)


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

const pluginA = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {},
    exports() { return { x: 1, } },
  };
}
pluginA.pluginName = 'pluginA';

const pluginB = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      // 获取 pluginA 的导出值
      console.log(ctx.plugins.pluginA.x); // => 1
    },
  };
}
pluginA.pluginName = 'pluginA';
pluginB.pluginName = 'pluginB';
pluginB.meta = {
  dependencies: ['pluginA'],
}
await plugins.register(pluginA);
await plugins.register(pluginB);
```
> 注：ctx 是在插件 creator 中获取引擎 API 的上下文，具体定义参见 [IPublicModelPluginContext](#qEhTb)

####
#### 设置兼容引擎版本示例
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const builtinPluginRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      ...
    },
  };
}
builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
builtinPluginRegistry.meta = {
  engines: {
    lowcodeEngine: '^1.0.0', // 插件需要配合 ^1.0.0 的引擎才可运行
  },
}
await plugins.register(builtinPluginRegistry);
```
#### 设置插件参数版本示例
```typescript
import { plugins } from '@alilc/lowcode-engine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

const builtinPluginRegistry = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      // 1.0.4 之后的传值方式，通过 register(xxx, options)
      // 取值通过 options

      // 1.0.4 之前的传值方式，通过 init(..., preference)
      // 取值通过 ctx.preference.getValue()
    },
  };
}
builtinPluginRegistry.pluginName = 'builtinPluginRegistry';
builtinPluginRegistry.meta = {
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

// 从 1.0.4 开始，支持直接在 pluginCreator 的第二个参数 options 获取入参
await plugins.register(builtinPluginRegistry, { key1: 'abc', key5: 'willNotPassToPlugin' });

// 1.0.4 之前，通过 preference 来传递 / 获取值
const preference = new Map();
preference.set('builtinPluginRegistry', {
  key1: 'abc',
  key5: 'willNotPassToPlugin', // 因为 key5 不在插件声明可接受的参数里
});

init(document.getElementById('lce'), engineOptions, preference);

```

### get
获取插件实例

**类型定义**
```typescript
function get(pluginName: string): ILowCodePlugin | undefined
```
**调用示例**
```typescript
import { plugins } from '@alilc/lowcode-engine';

plugins.get(builtinPluginRegistry);
```
###
### getAll
获取所有插件实例

**类型定义**
```typescript
function getAll(): ILowCodePlugin[]
```
**调用示例**
```typescript
import { plugins } from '@alilc/lowcode-engine';

plugins.getAll();
```
###
### has
判断是否已经加载了指定插件
**类型定义**
```typescript
function has(pluginName: string): boolean
```
**调用示例**
```typescript
import { plugins } from '@alilc/lowcode-engine';

plugins.has('builtinPluginRegistry');
```
### delete
删除指定插件
**类型定义**
```typescript
async function delete(pluginName: string): Promise<boolean>
```
**调用示例**
```typescript
import { plugins } from '@alilc/lowcode-engine';

plugins.delete('builtinPluginRegistry');
```
##
## 事件（events）
无
## 相关模块
### IPublicModelPluginContext
**类型定义**
```typescript
export interface IPublicModelPluginContext {
  get skeleton(): IPublicApiSkeleton;
  get hotkey(): IPublicApiHotkey;
  get setters(): IPublicApiSetters;
  get config(): IEngineConfig;
  get material(): IPublicApiMaterial;
  get event(): IPublicApiEvent;
  get project(): IPublicApiProject;
  get common(): IPublicApiCommon;
  logger: IPublicApiLogger;
  plugins: IPublicApiPlugins;
  preference: IPluginPreferenceMananger;
}
```
### IPublicTypePluginConfig
**类型定义**
```typescript
export interface IPublicTypePluginConfig {
  init?(): void;
  destroy?(): void;
  exports?(): any;
}
```
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
```json
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
###

## 使用示例

更多示例参考：[https://github.com/alibaba/lowcode-demo/blob/058450edb584d92be6cb665b1f3a9646ba464ffa/src/universal/plugin.tsx#L36](https://github.com/alibaba/lowcode-demo/blob/058450edb584d92be6cb665b1f3a9646ba464ffa/src/universal/plugin.tsx#L36)
