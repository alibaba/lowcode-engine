---
title: config - 配置 API
sidebar_position: 8
---

> **@types** [IPublicModelEngineConfig](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/engine-config.ts)<br/>
> **@since** v1.0.0


## 模块简介
配置模块，负责配置的读、写等操作。

## 方法
### get
获取指定 key 的值

```typescript
/**
 * 获取指定 key 的值
 * get value by key
 * @param key
 * @param defaultValue
 * @returns
 */
get(key: string, defaultValue?: any): any;
```
#### 示例
```typescript
import { config } from '@alilc/lowcode-engine';

config.get('keyA', true);
config.get('keyB', { a: 1 });
```
### set
设置指定 key 的值

```typescript
/**
 * 设置指定 key 的值
 * set value for certain key
 * @param key
 * @param value
 */
set(key: string, value: any): void;
```
#### 示例
```typescript
import { config } from '@alilc/lowcode-engine';

config.set('keyC', 1);
```

### has
判断指定 key 是否有值

```typescript
/**
 * 判断指定 key 是否有值
 * check if config has certain key configed
 * @param key
 * @returns
 */
has(key: string): boolean;
```

#### 示例
```typescript
import { config } from '@alilc/lowcode-engine';

config.has('keyD');
```

### setConfig
批量设值，set 的对象版本

```typescript
/**
 * 批量设值，set 的对象版本
 * set multiple config key-values
 * @param config
 */
setConfig(config: { [key: string]: any }): void;
```
#### 示例
```typescript
import { config } from '@alilc/lowcode-engine';

config.setConfig({ keyA: false, keyB: 2 });
```

### getPreference
获取全局 Preference 管理器，用于管理全局浏览器侧用户 Preference，如 Panel 是否钉住

```typescript
/**
 * 获取全局 Preference, 用于管理全局浏览器侧用户 Preference，如 Panel 是否钉住
 * get global user preference manager, which can be use to store
 * user`s preference in user localstorage, such as a panel is pinned or not.
 * @returns {IPublicModelPreference}
 * @since v1.1.0
 */
getPreference(): IPublicModelPreference;
```
相关类型：[IPublicModelPreference](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/model/preference.ts)

**@since v1.1.0**

示例

```javascript
import { config } from '@alilc/lowcode-engine';

const panelName = 'outline-master-pane';

// 设置大纲树面板钉住，在大纲树下次重新打开时生效
config.getPreference().set(`${panelName}-pinned-status-isFloat`, false, 'skeleton')
```

## 事件

### onceGot
获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
注：此函数返回 Promise 实例


```typescript
/**
 * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
 *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
 * wait until value of certain key is set, will only be
 * triggered once.
 * @param key
 * @returns
 */
onceGot(key: string): Promise<any>;
```
#### 示例
```typescript
import { config } from '@alilc/lowcode-engine';

config.onceGot('keyA').then(value => {
  console.log(`The value of keyA is ${value}`);
});

// or
const value = await config.onceGot('keyA');
```

### onGot
获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用

```typescript
  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * set callback for event of value set for some key
   * this will be called each time the value is set
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: string, fn: (data: any) => void): () => void;
```
#### 示例
```typescript
import { config } from '@alilc/lowcode-engine';

config.onGot('keyA', (value) => {
  console.log(`The value of keyA is ${value}`);
});

const.set('keyA', 1); // 'The value of keyA is 1'
const.set('keyA', 2); // 'The value of keyA is 2'
```