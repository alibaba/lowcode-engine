import {
  UniversalMtopClient,
  UniversalMtopClientConfig,
} from '@ali/mirror-io-client-universal-mtop';

import { RuntimeOptionsConfig } from '@ali/build-success-types';

type Method = 'get' | 'post' | 'GET' | 'POST';

type DataType = 'jsonp' | 'json' | 'originaljsonp';

export function createMopenHandler<T = unknown>(
  config?: UniversalMtopClientConfig,
) {
  return async function (options: RuntimeOptionsConfig): Promise<{ data: T }> {
    const { data, response } = await UniversalMtopClient.request<T>({
      config,
      ...options,
      api: options.uri,
      v: options.v as string,
      data: options.params,
      type: (options.method as Method) || 'get',
      dataType: (options.dataType as DataType) || 'json',
      timeout: options.timeout,
      headers: options.headers,
    });
    return { ...response, data };
  };
}
