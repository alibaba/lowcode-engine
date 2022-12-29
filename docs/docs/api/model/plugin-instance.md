---
title: plugin-instance
sidebar_position: 12
---

> **@types** [IPublicModelPluginInstance](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/plugin-instance.ts)<br/>
> **@since** v1.1.0


## 基本介绍

插件实例

## 属性

### pluginName

插件名字

```typescript
get name(): string;
```

### dep

插件依赖

```typescript
get dep(): string[];
```

### disabled

插件是否禁用

```typescript
get disabled(): boolean

set disabled(disabled: boolean): void;

```

### meta

插件 meta 信息

```typescript
get meta(): IPublicTypePluginMeta

```

- [IPublicTypePluginMeta](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/plugin-meta.ts)


