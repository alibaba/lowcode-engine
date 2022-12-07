---
title: 数据源引擎设计
sidebar_position: 7
---
## 核心原理

考虑之后的扩展性和兼容性，核心分为了 2 类包，一个是 **datasource-engine** ，另一个是 **datasource-engine-x-handler** ，x 的意思其实是对应数据源的 type，比如说 **datasource-engine-mtop-handler**，也就是说我们会将真正的请求工具放在 handler 里面去处理，engine 在使用的时候由使用方自身来决定需要注册哪些 handler，这样的目的有 2 个，一个是如果将所有的 handler 都放到一个包，对于端上来说这个包过大，有一些浪费资源和损耗性能的问题，另一个是如果有新的类型的数据源出现，只需要按照既定的格式去新增一个对应的 handler 处理器即可，达到了高扩展性的目的；

![](https://img.alicdn.com/imgextra/i3/O1CN011ep9No2ACzrgzgtk0_!!6000000008168-2-tps-720-370.png)

### DataSourceEngine

- engine：engine 主要分 2 类，一类是面向 render 引擎的，可以从 engine/interpret 引入，一类是面向出码或者说直接单纯使用数据源引擎的场景，可以从 engine/runtime 引入，代码如下

```typescript
import { createInterpret, createRuntime } from '@alilc/lowcode-datasource-engine';
```

create 方法定义如下

```typescript
interface IDataSourceEngineFactory {
    create(dataSource: DataSource, context: Omit<IRuntimeContext, 'dataSourceMap' | 'reloadDataSource'>, extraConfig?: {
        requestHandlersMap: RequestHandlersMap;
        [key: string]: any;
    }): IDataSourceEngine;
}
```

create 接收三个参数，第一个是 DataSource，对于运行时渲染和出码来说，DataSource 的定义分别如下：

```typescript
/**
 * 数据源对象--运行时渲染
 */
export interface DataSource {
    list: DataSourceConfig[];
    dataHandler?: JSFunction;
}

/**
 * 数据源对象
 */
export interface DataSourceConfig {
    id: string;
    isInit: boolean | JSExpression;
    type: string;
    requestHandler?: JSFunction;
    dataHandler?: JSFunction;
    options?: {
        uri: string | JSExpression;
        params?: JSONObject | JSExpression;
        method?: string | JSExpression;
        isCors?: boolean | JSExpression;
        timeout?: number | JSExpression;
        headers?: JSONObject | JSExpression;
        [option: string]: CompositeValue;
    };
    [otherKey: string]: CompositeValue;
}
```

但是对于出码来说，create 和 DataSource 定义如下：

```typescript
export interface IRuntimeDataSourceEngineFactory {
    create(dataSource: RuntimeDataSource, context: Omit<IRuntimeContext, 'dataSourceMap' | 'reloadDataSource'>, extraConfig?: {
        requestHandlersMap: RequestHandlersMap;
        [key: string]: any;
    }): IDataSourceEngine;
}

export interface RuntimeOptionsConfig {
    uri: string;
    params?: Record<string, unknown>;
    method?: string;
    isCors?: boolean;
    timeout?: number;
    headers?: Record<string, unknown>;
    shouldFetch?: () => boolean;
    [option: string]: unknown;
}
export declare type RuntimeOptions = () => RuntimeOptionsConfig; // 考虑需要动态获取值的情况，这里在运行时会真正的转为一个 function

export interface RuntimeDataSourceConfig {
    id: string;
    isInit: boolean;
    type: string;
    requestHandler?: () => {};
    dataHandler: (data: unknown, err?: Error) => {};
    options?: RuntimeOptions;
    [otherKey: string]: unknown;
}

/**
 * 数据源对象
 */
export interface RuntimeDataSource {
    list: RuntimeDataSourceConfig[];
    dataHandler?: (dataMap: DataSourceMap) => void;
}
```

2 者的区别还是比较明显的，一个是带 js 表达式一类的字符串，另一个是真正转为直接可以运行的 js 代码，对于出码来说，转为可执行的 js 代码的过程是出码自身负责的，对于渲染引擎来说，它只能接受到初始的 schema json 所以需要数据源引擎来做转化

- context：数据源引擎内部有一些使用了 this 的表达式，这些表达式需要求值的时候依赖上下文，因此需要将当前的上下文丢给数据源引擎，另外在 handler 里面去赋值的时候，也会用到诸如 setState 这种上下文里面的 api，当然，这个是可选的，我们后面再说。

```typescript
/**
 * 运行时上下文--暂时是参考 react，当然可以自己构建，完全没问题
 */
export interface IRuntimeContext<TState extends object = Record<string, unknown>> {
    /** 当前容器的状态 */
    readonly state: TState;
    /** 设置状态 (浅合并) */
    setState(state: Partial<TState>): void;
    /** 自定义的方法 */
    [customMethod: string]: any;
    /** 数据源，key 是数据源的 ID */
    dataSourceMap: Record<string, IRuntimeDataSource>;
    /** 重新加载所有的数据源 */
    reloadDataSource(): Promise<void>;
    /** 页面容器 */
    readonly page: IRuntimeContext & {
        readonly props: Record<string, unknown>;
    };
    /** 低代码业务组件容器 */
    readonly component: IRuntimeContext & {
        readonly props: Record<string, unknown>;
    };
}
```

- extraConfig：这个字段是为了留着扩展用的，除了一个必填的字段 **requestHandlersMap**

```typescript
export declare type RequestHandler<T = unknown> = (ds: RuntimeDataSourceConfig, context: IRuntimeContext) => Promise<RequestResult<T>>;
export declare type RequestHandlersMap = Record<string, RequestHandler>;
```

RequestHandlersMap 是一个把数据源以及对应的数据源 handler 关联起来的桥梁，它的 key 对应的是数据源 DataSourceConfig 的 type，比如 mtop/http/jsonp ... ，每个类型的数据源在真正使用的时候会调用对应的 type-handler，并将当前的参数和上下文带给对应的 handler。

create 调用结束后，可以获取到一个 DataSourceEngine 实例

```typescript
export interface IDataSourceEngine {
    /** 数据源，key 是数据源的 ID */
    dataSourceMap: Record<string, IRuntimeDataSource>;
    /** 重新加载所有的数据源 */
    reloadDataSource(): Promise<void>;
}
```
