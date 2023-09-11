---
title: config options - 配置列表
sidebar_position: 13
---

> **@types** [IPublicTypeEngineOptions](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/engine-options.ts)<br/>

## 配置方式

#### init API

```javascript
import { init } from '@alilc/lowcode-engine';

init(document.getElementById('engine'), {
  enableCondition: false,
});
```

[**init api**](./init)

#### config API

```javascript
import { config } from '@alilc/lowcode-engine';

config.set('enableCondition', false)
```

[**config api**](./config)

## 配置详情

> 源码详见 [IPublicTypeEngineOptions](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/engine-options.ts)


### 画布

#### locale - 语言

`@type {string}`、`@default {zh-CN}`

语言

#### device - 设备类型

`@type {string}`

引擎默认支持的 device 类型有 `default`、`mobile`、`iphonex`、`iphone6`。

插件 `@alilc/lowcode-plugin-simulator-select` 支持的 device 类型有 `default`、`phone`、`tablet`、`desktop`。

如果需要自定义的 device 类型，需要补充 device 类型对应的样式，例如 device 为 phone 时，需要补充样式如下：

```css
.lc-simulator-device-phone {
  top: 16px;
  bottom: 16px;
  left: 50%;
  width: 375px;
  transform: translateX(-50%);
  margin: auto;
}
```

#### deviceClassName

`@type {string}`

指定初始化的 deviceClassName，挂载到画布的顶层节点上

#### appHelper

与 react-renderer 的 appHelper 一致，https://lowcode-engine.cn/site/docs/guide/expand/runtime/renderer#apphelper


#### enableCondition

`@type {boolean}`

是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示

#### disableAutoRender

`@type {boolean}` `@default {false}`

关闭画布自动渲染，在资产包多重异步加载的场景有效

#### renderEnv - 渲染器类型

渲染器类型

`@type {string}`、`@default {react}`

#### simulatorUrl

`@type {string[]}`

设置 simulator 相关的 url

#### enableStrictNotFoundMode

`@type {boolean}` `@default {false}`

当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件

### 编排

#### focusNodeSelector - 指定根组件

配置指定节点为根组件

类型定义

```typescript
  focusNodeSelector?: (rootNode: Node) => Node;
```

#### supportVariableGlobally - 全局变量配置

`@type {boolean}` `@default {false}`

设置所有属性支持变量配置

开启拖拽组件时，即将被放入的容器是否有视觉反馈

#### customizeIgnoreSelectors - 点击忽略

配置画布中，需要屏蔽点击事件的元素，即配置的元素默认点击行为均不生效。

类型定义:

```typescript
  customizeIgnoreSelectors?: (defaultIgnoreSelectors: string[], e: MouseEvent) => string[];
```

默认值:

```javascript
() => {
  return [
    '.next-input-group',
    '.next-checkbox-group',
    '.next-checkbox-wrapper',
    '.next-date-picker',
    '.next-input',
    '.next-month-picker',
    '.next-number-picker',
    '.next-radio-group',
    '.next-range',
    '.next-range-picker',
    '.next-rating',
    '.next-select',
    '.next-switch',
    '.next-time-picker',
    '.next-upload',
    '.next-year-picker',
    '.next-breadcrumb-item',
    '.next-calendar-header',
    '.next-calendar-table',
    '.editor-container', // 富文本组件
  ]
}
```

#### enableCanvasLock

`@type {boolean}` `@default {false}`

打开画布的锁定操作

#### enableLockedNodeSetting

`@type {boolean}` `@default {false}`

容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效

#### enableMouseEventPropagationInCanvas

`@type {boolean}` `@default {false}`

鼠标事件（mouseover、mouseleave、mousemove）在画布中是否允许冒泡，默认不允许。

#### enableReactiveContainer

`@type {boolean}` `@default {false}`

#### disableDetecting

`@type {boolean}` `@default {false}`

关闭拖拽组件时的虚线响应，性能考虑


#### disableDefaultSettingPanel

`@type {boolean}` `@default {false}`

禁止默认的设置面板

#### disableDefaultSetters

`@type {boolean}` `@default {false}`

禁止默认的设置器

#### stayOnTheSameSettingTab

`@type {boolean}` `@default {false}`

当选中节点切换时，是否停留在相同的设置 tab 上

#### hideSettingsTabsWhenOnlyOneItem

`@type {boolean}` `@default {false}`

是否在只有一个 item 的时候隐藏设置 tabs

#### thisRequiredInJSE

`@type {boolean}` `@default {true}`

JSExpression 是否只支持使用 this 来访问上下文变量，假如需要兼容原来的 'state.xxx'，则设置为 false

### 应用级设计器

#### enableWorkspaceMode - 应用级设计模式

`@type {boolean}` `@default {false}`

开启应用级设计模式

#### enableAutoOpenFirstWindow

`@type {boolean}` `@default {true}`

应用级设计模式下，自动打开第一个窗口

#### workspaceEmptyComponent

应用级设计模式下，当窗口为空时，展示的占位组件

### 定制组件

#### faultComponent

组件渲染错误时的占位组件

#### notFoundComponent

组件不存在时的占位组件

#### loadingComponent - loading 组件

自定义 loading 组件

### 插件

#### defaultSettingPanelProps

内置设置面板插件的 panelProps

#### defaultOutlinePaneProps

内置大纲树面板插件的 panelProps

### 其他

#### enableStrictPluginMode

`@type {boolean}`

开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项

#### requestHandlersMap

数据源引擎的请求处理器映射

#### customPluginTransducer

插件处理中间件，方便提供插件调试能力

类型定义

```typescript
customPluginTransducer: async (originPlugin: IPublicTypePlugin, ctx: IPublicModelPluginContext, options): IPublicTypePlugin;
```

#### defaultOutlinePaneProps

`@type {object}`

大纲树插件面板默认 props

