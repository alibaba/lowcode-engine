import mtop from '@ali/universal-mtop';
import { RequestHandler } from '../types';

const mtopHandler: RequestHandler = async ({ data, params, ...options }) => {
  const reqOptions = {
    ...options,
    data: data || params,
  };

  const res = await mtop(reqOptions);

  return res.data;
};

export default mtopHandler;
