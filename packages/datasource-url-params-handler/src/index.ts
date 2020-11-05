import qs from 'query-string';
import { UrlParamsHandler } from '@ali/lowcode-datasource-types';

export function createUrlParamsHandler<T = unknown>(
  searchString: string | T = '',
): UrlParamsHandler<T> {
  // eslint-disable-next-line space-before-function-paren
  return async function(): Promise<T> {
    if (typeof searchString === 'string') {
      const params = (qs.parse(searchString) as unknown) as T;
      return params;
    }

    return searchString;
  };
}
