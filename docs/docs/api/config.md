---
title: config - 配置 API
sidebar_position: 8
---
## 模块简介
配置模块，负责配置的读、写等操作。
##
## 变量（variables）
无
##
## 方法签名（functions）
### get
获取指定 key 的值

**类型定义**
```typescript
function get(key: string, defaultValue?: any): any
```
**调用示例**
```typescript
import { config } from '@alilc/lowcode-engine';

config.get('keyA', true);
config.get('keyB', { a: 1 });
```
### set
设置指定 key 的值

**类型定义**
```typescript
function set(key: string, value: any)
```
**调用示例**
```typescript
import { config } from '@alilc/lowcode-engine';

config.set('keyC', 1);
```

### has
判断指定 key 是否有值

**类型定义**
```typescript
function has(key: string): boolean
```
**调用示例**
```typescript
import { config } from '@alilc/lowcode-engine';

config.has('keyD');
```
###
### setConfig
批量设值，set 的对象版本

**类型定义**
```typescript
function setConfig(config: { [key: string]: any })
```
**调用示例**
```typescript
import { config } from '@alilc/lowcode-engine';

config.setConfig({ keyA: false, keyB: 2 });
```

### onceGot
获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
注：此函数返回 Promise 实例

**类型定义**
```typescript
function onceGot(key: string): Promise<any>
```
**调用示例**
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

**类型定义**
```typescript
function onGot(key: string, fn: (data: any) => void): () => void
```
**调用示例**
```typescript
import { config } from '@alilc/lowcode-engine';

config.onGot('keyA', (value) => {
  console.log(`The value of keyA is ${value}`);
});

const.set('keyA', 1); // 'The value of keyA is 1'
const.set('keyA', 2); // 'The value of keyA is 2'
```
## 事件（events）
无
