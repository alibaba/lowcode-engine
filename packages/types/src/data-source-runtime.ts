import { IRuntimeDataSource } from './data-source';

// 先定义运行模式的类型
export interface RuntimeDataSource {
  list: RuntimeDataSourceConfig[];
  // TODO: dataMap 格式不对要处理
  dataHandler?: (dataMap: DataSourceMap) => void;
}

export type DataSourceMap = Record<string, IRuntimeDataSource>;

export interface RuntimeDataSourceConfig {
  id: string;
  isInit?: boolean;
  isSync?: boolean;
  type?: string;
  willFetch?: () => void;
  shouldFetch?: () => boolean;
  requestHandler?: () => void; // TODO: 待定
  dataHandler?: DataHandler;
  errorHandler?: ErrorHandler;
  options?: RuntimeOptions;
  [otherKey: string]: unknown;
}

export type DataHandler = <T>(response: {
  data: T;
  [index: string]: unknown;
}) => Promise<T | undefined>;

export type ErrorHandler = (err: unknown) => Promise<any>;

export type RuntimeOptions = () => RuntimeOptionsConfig;

export interface RuntimeOptionsConfig {
  uri: string;
  params?: Record<string, unknown>;
  method?: string;
  isCors?: boolean;
  timeout?: number;
  headers?: Record<string, unknown>;
  [option: string]: unknown;
}

// 可以采用 react 的 state，但是需要注意必须提供同步的 setState 功能
export interface IDataSourceRuntimeContext<
  TState extends Record<string, unknown> = Record<string, unknown>
  > {
  /** 当前数据源的内容 */
  state: TState;
  /** 设置状态(浅合并) */
  setState(state: Partial<TState>): void;
}
