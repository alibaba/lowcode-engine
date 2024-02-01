---
title: logger - 日志 API
sidebar_position: 10
---

> **@types** [IPublicApiLogger](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/api/logger.ts)<br/>
> **@since** v1.0.0


## 模块简介
引擎日志模块，可以按照 **日志级别 **和** 业务类型 **两个维度来定制日志。
> 注：日志级别可以通过 url query 动态调整，详见下方[查看示例](#查看示例)。<br/>
> 参考 [zen-logger](https://web.npm.alibaba-inc.com/package/zen-logger) 实现进行封装

## 方法

日志记录方法

```typescript
/**
 * debug info
 */
debug(...args: any | any[]): void;

/**
 * normal info output
 */
info(...args: any | any[]): void;

/**
 * warning info output
 */
warn(...args: any | any[]): void;

/**
 * error info output
 */
error(...args: any | any[]): void;

/**
 * log info output
 */
log(...args: any | any[]): void;
```

## 输出示例

```typescript
import { Logger } from '@alilc/lowcode-utils';
const logger = new Logger({ level: 'warn', bizName: 'myPlugin:moduleA' });
logger.log('Awesome Low-Code Engine');
```

## 查看示例

开启查看方式：

- 方式 1：所有 logger 创建时会有默认输出的 level, 默认为 warn , 即只展示 warn , error
- 方式 2：url 上追加 __logConf__进行开启，示例如下

```
https://lowcode-engine.cn/demo/demo-general/index.html?__logConf__=warn
// 开启所有 bizName的 warn 和 error

https://lowcode-engine.cn/demo/demo-general/index.html?__logConf__=debug
// 开启所有 bizName的 debug, log, info, warn 和 error

https://lowcode-engine.cn/demo/demo-general/index.html?__logConf__=log
// 开启所有 bizName的 log, info, warn 和 error

https://lowcode-engine.cn/demo/demo-general/index.html?__logConf__=warn|*
// 同 __logConf__=warn

https://lowcode-engine.cn/demo/demo-general/index.html?__logConf__=warn|bizName
// 开启 bizName 的 debug, log, info, warn 和 error

https://lowcode-engine.cn/demo/demo-general/index.html?__logConf__=warn|partOfBizName
// 开启 bizName like '%partOfBizName%' 的 debug, log, info, warn 和 error

```
