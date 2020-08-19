import qs from 'query-string';
import { RequestHandler } from '../types';

export default function urlParamsHandler({
  search,
}: {
  search: string | Record<string, unknown>;
}): RequestHandler {
  const urlParams = typeof search === 'string' ? qs.parse(search) : search;

  return async () => {
    return urlParams;
  };
}
