---
title: Prop
sidebar_position: 3
---
> **@types** [IPublicModelProp](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/prop.ts)<br/>
> **@since** v1.0.0

## 基本介绍

属性模型

## 属性

### id

id

`@type {string}`

### key

key 值

`@type {string | number | undefined}`

### path

返回当前 prop 的路径

`@type {string[]}`

### node

返回所属的节点实例

`@type {IPublicModelNode | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)

### slotNode

当本 prop 代表一个 Slot 时，返回对应的 slotNode

`@type {IPublicModelNode | undefined | null}`

相关类型：[IPublicModelNode](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/node.ts)


## 方法

### setValue

设置值

```typescript
/**
 * 设置值
 * set value for this prop
 * @param val
 */
setValue(val: IPublicTypeCompositeValue): void;
```

相关类型：[IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)

### getValue

获取值

```typescript
/**
 * 获取值
 * get value of this prop
 */
getValue(): any;
```

### remove

移除值

```typescript
/**
 * 移除值
 * remove value of this prop
 * @since v1.0.16
 */
remove(): void;
```

**@since v1.0.16**

### exportSchema

导出值

```typescript
/**
 * 导出值
 * export schema
 * @param stage
 */
exportSchema(stage: IPublicEnumTransformStage): IPublicTypeCompositeValue;
```

相关类型：
- [IPublicEnumTransformStage](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/enum/transform-stage.ts)
- [IPublicTypeCompositeValue](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/composite-value.ts)