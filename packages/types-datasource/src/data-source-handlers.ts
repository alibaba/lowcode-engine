import {
  IDataSourceRuntimeContext,
  RuntimeOptionsConfig,
} from './data-source-runtime';

export type RequestHandler<T = unknown> = (
  options: RuntimeOptionsConfig,
  context?: IDataSourceRuntimeContext,
) => Promise<T>;

export type UrlParamsHandler<T = unknown> = (
  context?: IDataSourceRuntimeContext,
) => Promise<T>;

export type RequestHandlersMap<T = unknown> = Record<string, RequestHandler<T>>;

// 仅在 type=custom 的时候生效的 handler
export type CustomRequestHandler<T = unknown> = (
  options: RuntimeOptionsConfig,
  context?: IDataSourceRuntimeContext,
) => Promise<T>;
