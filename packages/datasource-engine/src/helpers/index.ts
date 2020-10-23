import {
  DataHandler,
  RuntimeOptionsConfig,
  WillFetch,
} from '@ali/lowcode-types';

// 默认的 dataSourceItem 的 dataHandler
export const defaultDataHandler: DataHandler = async <T = unknown>(response: {
  data: T;
}) => response.data;

// 默认的 dataSourceItem 的 willFetch
export const defaultWillFetch: WillFetch = (options: RuntimeOptionsConfig) =>
  options;

// 默认的 dataSourceItem 的 shouldFetch
export const defaultShouldFetch = () => true;
