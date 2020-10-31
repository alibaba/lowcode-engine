import { RuntimeOptionsConfig } from '@ali/lowcode-types';
import jsonp from 'jsonp';

const handleJsonpFetch = (url: string, param: string, name: string) => {
  return new Promise((res, rej) => {
    jsonp(url, { param, name }, (error: Error | null, data: any) => {
      if (error) {
        return rej(error);
      }
      res({ data });
    });
  });
};

// config 留着扩展
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createJsonpHandler(config?: Record<string, unknown>) {
  // eslint-disable-next-line space-before-function-paren
  return async function(options: RuntimeOptionsConfig) {
    const params =
      typeof options.params === 'object'
        ? JSON.stringify(options.params)
        : options.params;
    const response = await handleJsonpFetch(
      options.uri,
      params || '',
      options.name as string | '',
    );
    return response;
  };
}
