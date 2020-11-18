import mtopRequest from '@ali/universal-mtop';

import { RuntimeOptionsConfig } from '@ali/lowcode-datasource-types';

export type Method = 'get' | 'post' | 'GET' | 'POST';

export type DataType = 'jsonp' | 'json' | 'originaljsonp';

// 考虑一下 mtop 类型的问题，官方没有提供 ts 文件
export function createMtopHandler<T = unknown>(config?: MTopConfig) {
  if (config && Object.keys(config).length > 0) {
    Object.keys(config).forEach((key: string) => {
      mtopRequest.config(key, config[key]);
    });
  }
  // eslint-disable-next-line space-before-function-paren
  return async function(options: RuntimeOptionsConfig): Promise<{ data: T }> {
    const response = await mtopRequest.request<T>({
      api: options.uri || options.api, // 兼容老的结构
      v: (options.v as string) || '1.0',
      data: options.params,
      type: (options.method as Method) || 'get',
      dataType: (options.dataType as DataType) || 'json',
      timeout: options.timeout,
      headers: options.headers,
    });
    if (response.ret && response.ret[0].indexOf('SUCCESS::') > -1) {
      // 校验成功
      return response;
    }
    // 默认异常
    let errorMsg = '未知异常';
    if (response.ret && response.ret[0]) {
      errorMsg = response.ret[0];
    }
    throw new Error(errorMsg);
  };
}
