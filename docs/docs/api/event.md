---
title: event - 事件 API
sidebar_position: 7
---

> **@types** [IPublicApiEvent](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/event.ts)<br/>
> **@since** v1.0.0


## 模块简介
负责事件处理 API，支持自定义监听事件、触发事件。

## 方法
### on
监听事件

```typescript
/**
 * 监听事件
 * add monitor to a event
 * @param event 事件名称
 * @param listener 事件回调
 */
on(event: string, listener: (...args: any[]) => void): IPublicTypeDisposable;
```
相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### prependListener
监听事件，会在其他回调函数之前执行

```typescript
/**
 * 监听事件，会在其他回调函数之前执行
 * @param event 事件名称
 * @param listener 事件回调
 */
prependListener(event: string, listener: (...args: any[]) => void): IPublicTypeDisposable;
```
相关类型：[IPublicTypeDisposable](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/disposable.ts)

### off
取消监听事件

```typescript
/**
 * 取消监听事件
 * cancel a monitor from a event
 * @param event 事件名称
 * @param listener 事件回调
 */
off(event: string, listener: (...args: any[]) => void): void;
```

### emit
触发事件

```typescript
/**
 * 触发事件
 * emit a message for a event
 * @param event 事件名称
 * @param args 事件参数
 * @returns
 */
emit(event: string, ...args: any[]): void;
```

## 使用示例
### 事件触发和监听

```typescript
const eventName = 'eventName';

// 事件监听
// 插件中发出的事件，默认以 `common` 为前缀，监听时需要注意下
event.on(`common:${eventName}`);

// 触发事件
event.emit(eventName);
```

### setter 和 setter/plugin 之间的联动
在 A setter 中进行事件注册：
```typescript
import { event } from '@alilc/lowcode-engine';

const SETTER_NAME = 'SetterA';

class SetterA extends React.Component {
  componentDidMount() {
    // 这里由于面板上会有多个 setter，使用 field.id 来标记 setter 名
    this.emitEventName = `${SETTER_NAME}-${this.props.field.id}`;
    event.on(`common:${this.emitEventName}.bindEvent`, this.bindEvent)
  }

  bindEvent = (eventName) => {
    // do someting
  }

  componentWillUnmount() {
  	// setter 是以实例为单位的，每个 setter 注销的时候需要把事件也注销掉，避免事件池过多
    event.off(`common:${this.emitEventName}.bindEvent`, this.bindEvent)
  }
}
```
在 B setter 中触发事件，来完成通信：
```typescript
import { event } from '@alilc/lowcode-engine';

class SetterB extends React.Component {
  bindFunction = () => {
    const { field, value } = this.props;
    // 这里展示的和插件进行通信，事件规则是插件名 + 方法
    event.emit('eventBindDialog.openDialog', field.name, this.emitEventName);
  }
}
```
