---
title: simulatorHost - 模拟器 API
sidebar_position: 3
---
> **@types** [IPublicApiSimulatorHost](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/simulator-host.ts)<br/>
> **@since** v1.0.0

## 模块简介
负责模拟器相关的 API，包括画布尺寸、语言等。

## 方法
### set
设置 host 配置值
```typescript
/**
 * 设置若干用于画布渲染的变量，比如画布大小、locale 等。
 * set config for simulator host, eg. device locale and so on.
 * @param key
 * @param value
 */
set(key: string, value: any): void;
```
#### 示例
设置若干用于画布渲染的变量，比如画布大小、locale 等。

以设置画布大小为例：
目前支持 3 种定制方式：
```typescript

// 直接使用内置设备类型
project.simulatorHost.set('device', 'mobile' / 'iphonex' / 'iphone6' / 'default');
// 定制 canvas 的样式类
project.simulatorHost.set('deviceClassName', 'my-canvas-class');
// 最灵活的方式，直接设置 canvas / viewport 的样式（canvas 是外框，viewport 是内框，可以在 canvas 设置手机 / 平板背景图）
project.simulatorHost.set('deviceStyle', { canvas: { width: '300px', backgroundColor: 'red' }, viewport: { width: '280px' } });
```

### get
获取模拟器中设置的变量，比如画布大小、locale 等。

```typescript
/**
 * 获取模拟器中设置的变量，比如画布大小、locale 等。
 * set config value by key
 * @param key
 * @returns
 */
get(key: string): any;

```

### rerender
触发组件构建，并刷新渲染画布

```typescript
/**
 * 触发组件构建，并刷新渲染画布
 * make simulator render again
 */
rerender(): void;
```

### scrollToNode
滚动到指定节点

```typescript
/**
 * 滚动到指定节点
 * scroll to specific node
 * @param node
 * @since v1.1.0
 */
scrollToNode(node: IPublicModelNode): void;
```
**@since v1.1.0**
