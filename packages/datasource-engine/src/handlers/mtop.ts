import mtop from '@ali/universal-mtop';
import { RequestHandler } from '../types';

const mtopHandler: RequestHandler = async (options) => {
  const { api, uri, data, params, type, method, ...otherOptions } = options;
  const reqOptions = {
    ...otherOptions,
    api: api || uri,
    data: data || params,
    type: type || method,
  };

  const res = await mtop(reqOptions);

  return res;
};

export default mtopHandler;
