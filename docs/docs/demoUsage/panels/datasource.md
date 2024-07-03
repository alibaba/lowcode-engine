---
title: 8. 数据源面板详解
sidebar_position: 4
---
## 🪚 概述
数据源面板主要负责管理低代码中远程数据源内容，通过可视化编辑的方式操作低代码协议中的数据源 Schema，配合 [数据源引擎](/site/docs/guide/design/datasourceEngine) 即可实现低代码中数据源的生产和消费；

![image.png](https://img.alicdn.com/imgextra/i1/O1CN0170HeBg276B7fM9rqh_!!6000000007747-2-tps-2878-1642.png)

数据源面板
## ❓如何使用
> 面板内包含了数据源创建、删除、编辑、排序、导入导出、复制以及搜索等能力，内置支持了 `fecth` & `JSONP`两种常用远程请求类型；

### 三步创建一个数据源
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01bkgbqj1cOGfwQtEif_!!6000000003590-2-tps-2878-1638.png)
三步创建数据源

### 参数详解
> TODO

## ☠️ 更多介绍
### 数据源顺序
> 数据源为何支持排序功能，主要原因是数据源的加载存在先后顺序；接下来我们从协议层以及实现层看数据源之间的顺序关系；

TODO
### 如何定制数据源
#### 定制数据源类型（设计态）
#### 定制数据源请求实现（运行态）

> 当出现以下两种情况的时，我们需要定制数据源请求实现，
> - 当你默认提供的 `handler`无法满足你的需求
> - 定制了数据源类型，比如 `GraphQL`，需要实现一个对应的 `handler`

接下来我们来看一个例子，如何实现一个 `handler`

```javascript
import { RuntimeOptionsConfig } from '@alilc/lowcode-datasource-types';

import request from 'universal-request';
import { RequestOptions, AsObject } from 'universal-request/lib/types';

export function createFetchHandler(config?: Record<string, unknown>) {
  return async function(options: RuntimeOptionsConfig) {
    const requestConfig: RequestOptions = {
      ...options,
      url: options.uri,
      method: options.method as RequestOptions['method'],
      data: options.params as AsObject,
      headers: options.headers as AsObject,
      ...config,
    };
    const response = await request(requestConfig);
    return response;
  };
}
```
低代码 fetch-handler 默认实现

以上代码是低代码内置的 fetch-handler 默认实现，内部使用了 `universal-request`，假如你们内部使用的 `axios`，你完全重新实现一个；
```javascript
import axios from 'axios';
export function createAxiosFetchHandler(config?: Record<string, unknown>) {
  return async function(options: RuntimeOptionsConfig) {
    const requestConfig: RequestOptions = {
      ...options,
      url: options.uri,
      method: options.method as RequestOptions['method'],
      data: options.params,
      headers: options.headers,
      ...config,
    };
    const response = await axios(requestConfig);
    return response;
  };
}
```

##### 注册到 render
完成一个 Handler 后你可以通过以下方式接入到 render 或者出码中使用

###### 渲染 Render
```tsx
import React, { memo } from 'react';
import ReactRenderer from '@alilc/lowcode-react-renderer';

const SamplePreview = memo(() => {
  return (
    <ReactRenderer
      className="lowcode-plugin-sample-preview-content"
      schema={schema}
      components={components}
      appHelper={{
        requestHandlersMap: {
          fetch: createAxiosFetchHandler()
        }
      }}
    />
  );
});
```
###### 出码
> 目前自定义只能通过重新定义类型来完成，接下来我们会给出码添加 requestHandlersMap 映射能力；如有需求请联系 荣彬 (github-id:xingmolu)


###  设计态启用数据源引擎
> 默认情况下设计态没有开启数据源引擎，我们可以在设计器 init 的时候来传递`requstHandlersMap`来开启；具体代码如下：

```javascript
import { init, plugins } from '@alilc/lowcode-engine';
import { RequestHandlersMap } from '@alilc/lowcode-datasource-types';

const preference = new Map();

(async function main() {
  await plugins.register(scenarioSwitcher);
  await registerPlugins();

  init(document.getElementById('lce-container')!, {
    // designMode: 'live',
    // locale: 'zh-CN',
    enableCondition: true,
    enableCanvasLock: true,
    // 默认绑定变量
    supportVariableGlobally: true,
    supportResetGlobally: true,
    // simulatorUrl 在当 engine-core.js 同一个父路径下时是不需要配置的！！！
    // 这里因为用的是 alifd cdn，在不同 npm 包，engine-core.js 和 react-simulator-renderer.js 是不同路径
    simulatorUrl: [
      'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/css/react-simulator-renderer.css',
      'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/js/react-simulator-renderer.js'
    ],
    requestHandlersMap: {
      fetch: createAxiosFetchHandler()
    }
  }, preference);
})();

```
## 🥡 附录
### 数据源协议
| **参数** | **说明** | **类型** | **支持变量** | **默认值** | **备注** |
| --- | --- | --- | --- | --- | --- |
| id | 数据请求 ID 标识 | String | - | - |  |
| isInit | 是否为初始数据 | Boolean | ✅ | true | 值为 true 时，将在组件初始化渲染时自动发送当前数据请求 |
| isSync | 是否需要串行执行 | Boolean | ✅ | false | 值为 true 时，当前请求将被串行执行 |
| type | 数据请求类型 | String | - | fetch | 支持四种类型：fetch/mtop/jsonp/custom |
| shouldFetch | 本次请求是否可以正常请求 | (options: ComponentDataSourceItemOptions) => boolean | - | () => true | function 参数参考 [ComponentDataSourceItemOptions 对象描述](/site/docs/specs/lowcode-spec#2315-componentdatasourceitemoptions-对象描述) |
| willFetch | 单个数据结果请求参数处理函数 | Function | - | options => options | 只接受一个参数（options），返回值作为请求的 options，当处理异常时，使用原 options。也可以返回一个 Promise，resolve 的值作为请求的 options，reject 时，使用原 options |
| requestHandler | 自定义扩展的外部请求处理器 | Function | - | - | 仅 type=‘custom’时生效 |
| dataHandler | request 成功后的回调函数 | Function | - | response => response.data | 参数：请求成功后 promise 的 value 值 |
| errorHandler | request 失败后的回调函数 | Function | - | - | 参数：请求出错 promise 的 error 内容 |
| options {} | 请求参数 | **ComponentDataSourceItemOptions**| - | - | 每种请求类型对应不同参数，详见见 [ComponentDataSourceItemOptions 对象描述](/site/docs/specs/lowcode-spec#2315-componentdatasourceitemoptions-对象描述) |

### 运行时实现层：数据源引擎设计
[数据源引擎设计](/site/docs/guide/design/datasourceEngine)
