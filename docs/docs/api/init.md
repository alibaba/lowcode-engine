---
title: init - 初始化 API
sidebar_position: 10
---

> **@since** v1.0.0


## 模块简介
提供 init 等方法
## 方法
#### 1. init
初始化引擎

**方法定义**
```typescript
function init(container?: Element, options?: IPublicTypeEngineOptions): void
```

**初始化引擎的参数**

```typescript
interface IPublicTypeEngineOptions {
  /**
   * 指定初始化的 device
   */
  device?: 'default' | 'mobile';
  /**
   * 指定初始化的 deviceClassName，挂载到画布的顶层节点上
   */
  deviceClassName?: string;
  /**
   * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
   */
  enableCondition?: boolean;
  /**
   * 开启拖拽组件时，即将被放入的容器是否有视觉反馈，默认值：false
   */
  enableReactiveContainer?: boolean;
  /**
   * 关闭画布自动渲染，在资产包多重异步加载的场景有效，默认值：false
   */
  disableAutoRender?: boolean;
  /**
   * 打开画布的锁定操作，默认值：false
   */
  enableCanvasLock?: boolean;
  /**
   * 容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效，默认值为：false
   */
  enableLockedNodeSetting?: boolean;
  /**
   * 开启画布上的鼠标事件的冒泡，默认值：false
   */
  enableMouseEventPropagationInCanvas?: boolean;
  /**
   * 关闭拖拽组件时的虚线响应，性能考虑，默认值：false
   */
  disableDetecting?: boolean;
  /**
   * 定制画布中点击被忽略的 selectors，默认值：undefined
   */
  customizeIgnoreSelectors?: (defaultIgnoreSelectors: string[]) => string[];
  /**
   * 禁止默认的设置面板，默认值：false
   */
  disableDefaultSettingPanel?: boolean;
  /**
   * 禁止默认的设置器，默认值：false
   */
  disableDefaultSetters?: boolean;
  /**
   * 当选中节点切换时，是否停留在相同的设置 tab 上，默认值：false
   */
  stayOnTheSameSettingTab?: boolean;
  /**
   * 自定义 loading 组件
   */
  loadingComponent?: ComponentType;

  /**
   * @default true
   * JSExpression 是否只支持使用 this 来访问上下文变量，假如需要兼容原来的 'state.xxx'，则设置为 false
   */
  thisRequiredInJSE?: boolean;

  /**
   * @default false
   * >= 1.0.14
   * 当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件
   */
  enableStrictNotFoundMode?: boolean;

  /**
   * 配置指定节点为根组件
   * >= 1.0.15
   */
  focusNodeSelector?: (rootNode: Node) => Node;

  /**
   * 工具类扩展
   */
  appHelper?: {
    utils?: {};
  }

  [key: string]: any;
}
```
> 源码详见 [IPublicTypeEngineOptions](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/engine-options.ts)


## 使用示例
```typescript
import { init } from '@alilc/lowcode-engine';

init(document.getElementById('engine'), {
  enableCondition: false,
});
```
###
### 默认打开移动端画布
```typescript
import { init } from '@alilc/lowcode-engine';

init({
  device: 'mobile',
});
```

### 使用 utils 第三方工具扩展
```json
import { init } from '@alilc/lowcode-engine';

init({
  device: 'mobile',
  appHelper: {
    utils: {
      xxx: () => {console.log('123')},
    }
  }
});
```

在引擎中即可这样使用。
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01FWvu051OxAEYrHBy5_!!6000000001771-2-tps-3584-1796.png)
