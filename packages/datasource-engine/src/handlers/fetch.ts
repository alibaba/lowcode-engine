import request from 'universal-request';
import type { AsObject, RequestOptions } from 'universal-request/lib/types';

import { DataSourceOptions, RequestHandler } from '../types';

const fetchHandler: RequestHandler = async ({
  url,
  uri,
  data,
  params,
  ...otherOptions
}: DataSourceOptions) => {
  const reqOptions = {
    url: ((url || uri) as unknown) as string,
    data: ((data || params) as unknown) as AsObject,
    ...otherOptions,
  };

  const res = await request(reqOptions as RequestOptions);

  return res;
};

export default fetchHandler;
