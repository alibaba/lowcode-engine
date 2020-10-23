import { DataSourceOptions } from './DataSourceOptions';
import { RequestHandler } from './RequestHandler';

export type DataSourceConfigItem = {
  id: string;
  type: string;
  isInit?: boolean | (() => boolean | undefined);

  options?: DataSourceOptions | (() => DataSourceOptions | undefined);

  requestHandler?: RequestHandler;

  dataHandler?: (
    data: unknown | undefined,
    error: unknown | undefined,
  ) => unknown;
};
