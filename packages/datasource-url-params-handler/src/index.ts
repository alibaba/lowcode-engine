import qs from 'query-string';
import { UrlParamsHandler } from '@ali/lowcode-types';

export function createUrlParamsHandler<T = unknown>(
  searchString: string | T = '',
): UrlParamsHandler<T> {
  return async function (): Promise<T> {
    if (typeof searchString === 'string') {
      const params = (qs.parse(searchString) as unknown) as T;
      return params;
    }

    return searchString;
  };
}
