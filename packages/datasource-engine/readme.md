## 关于 @ali/lc-datasource-engine

低代码引擎数据源核心代码

## doc

[原理介绍](https://yuque.antfin-inc.com/docs/share/6ba9dab7-0712-4302-a5bb-b17d4a5f8505?# 《DataSource Engine》)


[fetch流程图](https://yuque.antfin-inc.com/docs/share/e9baef9a-3586-40fc-8708-eaeee0d7937e?# 《fetch 流程》)


## 使用

```ts
// 面向运行时渲染，直接给 schema
import { create } from '@ali/lowcode-datasource-engine/interpret'; 

// 面向出码，需要给处理过后的内容
import { create } from '@ali/lowcode-datasource-engine/runtime'; 

// dataSource 可以是 schema 协议内容 或者是运行时的转化后的配置内容 （出码专用）

// context 上下文(setState 为必选)
const dsf = create(dataSource, context, {
  requestHandlersMap: { // 可选参数，以下内容为当前默认的内容
    urlParams: handlersMap.urlParams('?bar=1&test=2'),
    mtop: mtophandlers,
  },
});


console.log(dsf.dataSourceMap) // 符合集团协议的 datasourceMap https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#QUSn5

dsf.dataSourceMap['id'].load() // 加载

dsf.dataSourceMap['id'].status // 获取状态

dsf.dataSourceMap['id'].data // 获取数据

dsf.dataSourceMap['id'].error // 获取错误信息 

dsf.reloadDataSource(); // 刷新所有数据源

```
