---
title: History
sidebar_position: 5
---
> **@types** [IPublicModelHistory](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/history.ts)<br/>
> **@since** v1.0.0

## 基本介绍

操作历史记录模型

## 方法签名
### go

历史记录跳转到指定位置

```typescript
/**
 * 历史记录跳转到指定位置
 * go to a specific history
 * @param cursor
 */
go(cursor: number): void;
```

### back

历史记录后退

```typescript
/**
 * 历史记录后退
 * go backward in history
 */
back(): void;
```

### forward

forward()

历史记录前进

```typescript
/**
 * 历史记录前进
 * go forward in history
 */
forward(): void;
```

### savePoint

保存当前状态

```typescript
/**
 * 保存当前状态
 * do save current change as a record in history
 */
savePoint(): void;
```

### isSavePoint

当前是否是「保存点」，即是否有状态变更但未保存

```typescript
/**
 * 当前是否是「保存点」，即是否有状态变更但未保存
 * check if there is unsaved change for history
 */
isSavePoint(): boolean;
```

### getState

获取 state，判断当前是否为「可回退」、「可前进」的状态

```typescript
/**
 * 获取 state，判断当前是否为「可回退」、「可前进」的状态
 * get flags in number which indicat current change state
 *
 *  |    1     |     1    |    1     |
 *  | -------- | -------- | -------- |
 *  | modified | redoable | undoable |
 * eg:
 *  7 means : modified && redoable && undoable
 *  5 means : modified && undoable
 */
getState(): number;
```

## 事件
### onChangeState

监听 state 变更事件

```typescript
/**
 * 监听 state 变更事件
 * monitor on stateChange event
 * @param func
 */
onChangeState(func: () => any): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### onChangeCursor

监听历史记录游标位置变更事件

```typescript
/**
 * 监听历史记录游标位置变更事件
 * monitor on cursorChange event
 * @param func
 */
onChangeCursor(func: () => any): IPublicTypeDisposable;
```

相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)