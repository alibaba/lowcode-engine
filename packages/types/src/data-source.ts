import { RequestHandlersMap } from './data-source-handlers';
import {
  IDataSourceRuntimeContext,
  RuntimeDataSource,
} from './data-source-runtime';

/** 数据源的状态 */
export enum RuntimeDataSourceStatus {
  /** 初始状态，尚未加载 */
  Initial = 'init',

  /** 正在加载 */
  Loading = 'loading',

  /** 已加载(无错误) */
  Loaded = 'loaded',

  /** 加载出错了 */
  Error = 'error',
}

/**
 * 运行时的数据源（对外暴露的接口）
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#Jwgj5
 */
export interface IRuntimeDataSource<TParams = unknown, TResultData = unknown> {
  /** 当前状态(initial/loading/loaded/error) */
  readonly status: RuntimeDataSourceStatus;

  /** 加载成功时的数据 */
  readonly data?: TResultData;

  /** 加载出错的时候的错误信息 */
  readonly error?: Error;

  /**
   * 加载数据 (无论是否曾经加载过)
   * 注意：若提供 params，则会和默认配置的参数做浅合并；否则会使用默认配置的参数。
   */
  load(params?: TParams): Promise<TResultData | void>;
}

/**
 * DataSourceEngineFactory
 * 用来定义 engine 的工厂函数类型
 */
export interface IRuntimeDataSourceEngineFactory {
  create(
    dataSource: RuntimeDataSource,
    context: IDataSourceRuntimeContext,
    extraConfig?: {
      requestHandlersMap: RequestHandlersMap;
      [key: string]: any;
    }
  ): IDataSourceEngine;
}

// create 返回的 DataSourceEngine 定义
export interface IDataSourceEngine {
  /** 数据源, key 是数据源的 ID */
  dataSourceMap: Record<string, IRuntimeDataSource>;

  /** 重新加载所有的数据源 */
  reloadDataSource(): Promise<void>;
}
