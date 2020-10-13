import {
  MopenClient,
  MopenClientConfig,
  MOPEN_APPKEY_XSPACE_PRE_ONLINE,
  MOPEN_DOMAIN_TAOBAO_PRE_ONLINE,
} from '@ali/mirror-io-client-mopen';
import { RuntimeOptionsConfig } from '@ali/lowcode-types';

type Method = 'get' | 'post' | 'GET' | 'POST';

type DataType = 'jsonp' | 'json' | 'originaljsonp';

export function createMopenHandler<T = unknown>(
  config: MopenClientConfig = {
    mtopDomain: MOPEN_DOMAIN_TAOBAO_PRE_ONLINE,
    appKey: MOPEN_APPKEY_XSPACE_PRE_ONLINE,
  },
) {
  return async function(options: RuntimeOptionsConfig): Promise<{ data: T }> {
    const { data, response } = await MopenClient.request<T>({
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
