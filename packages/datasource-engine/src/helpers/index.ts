import {
  DataHandler,
  RequestHandler,
  RequestHandlersMap,
  RuntimeDataSourceConfig,
  RuntimeOptionsConfig,
  UrlParamsHandler,
  WillFetch,
} from '@ali/lowcode-types';

// 默认的 dataSourceItem 的 dataHandler
export const defaultDataHandler: DataHandler = async <T = unknown>(response: { data: T }) => response.data;

// 默认的 dataSourceItem 的 willFetch
export const defaultWillFetch: WillFetch = (options: RuntimeOptionsConfig) => options;

// 默认的 dataSourceItem 的 shouldFetch
export const defaultShouldFetch = () => true;

type GetRequestHandler<T = unknown> = (
  ds: RuntimeDataSourceConfig,
  requestHandlersMap: RequestHandlersMap<{ data: T }>,
) => RequestHandler<{ data: T }> | UrlParamsHandler<T>;

// 从当前 dataSourceItem 中获取 requestHandler
export const getRequestHandler: GetRequestHandler = (ds, requestHandlersMap) => {
  if (ds.type === 'custom') {
    // 自定义类型处理
    return (ds.requestHandler as unknown) as RequestHandler<{ data: unknown }>; // 理论上这里应该是能强转的，就算为空，应该在 request 请求的时候触发失败
  }
  // type 协议默认值 fetch
  return requestHandlersMap[ds.type || 'fetch'];
};
