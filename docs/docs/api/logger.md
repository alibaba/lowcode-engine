---
title: logger - 日志 API
sidebar_position: 9
---
## 模块简介
引擎日志模块，可以按照 **日志级别 **和** 业务类型 **两个维度来定制日志，参考 [zen-logger](https://web.npm.alibaba-inc.com/package/zen-logger) 实现进行封装。
> 注：日志级别可以通过 url query 动态调整，详见下方使用示例。

## 变量（variables）
无
## 方法签名（functions）
### log / warn / error / info / debug
日志记录方法

**类型定义**
```typescript
function log(args: any[]): void
function warn(args: any[]): void
function error(args: any[]): void
function info(args: any[]): void
function debug(args: any[]): void
```
**调用示例**
```typescript
import { Logger } from '@alilc/lowcode-utils';
const logger = new Logger({ level: 'warn', bizName: 'designer:pluginManager' });
logger.log('Awesome Low-Code Engine');
```
## 事件（events）
无

## 使用示例
```typescript
import { Logger } from '@alilc/lowcode-utils';

const logger = new Logger({ level: 'warn', bizName: 'designer:pluginManager' });

// 若在 url query 中增加 `__logConf__` 可改变打印日志级别和限定业务类型日志
// 默认：__logConf__=warn:*
logger.log('log');          // 不输出
logger.warn('warn');        // 输出
logger.error('error');      // 输出

// 比如：__logConf__=log:designer:pluginManager
logger.log('log');          // 输出
logger.warn('warn');        // 输出
logger.error('error');      // 输出

```
