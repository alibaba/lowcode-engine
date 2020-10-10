import { DataHandler } from '@ali/build-success-types';

function noop() {}

// 默认的 dataSourceItem 的 dataHandler
export const defaultDataHandler: DataHandler = async <T = unknown>(response: {
  data: T;
}) => response.data;

// 默认的 dataSourceItem 的 willFetch
export const defaultWillFetch = noop;

// 默认的 dataSourceItem 的 shouldFetch
export const defaultShouldFetch = () => true;
