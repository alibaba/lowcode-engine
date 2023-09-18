---
title: SimulatorRender
sidebar_position: 6
---
> **@types** [IPublicModelSimulatorRender](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/simulator-render.ts)<br/>
> **@since** v1.0.0

## 基本介绍

画布节点选中模型

## 属性
### components

画布组件列表

```typescript
/**
  * 画布组件列表
  */
components: {
  [key: string]: any;
}
```

## 方法

### rerender

触发画布重新渲染

```typescript
/**
 * 触发画布重新渲染
 */
rerender: () => void;
```

