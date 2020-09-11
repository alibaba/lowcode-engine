import { DataSourceOptions } from './DataSourceOptions';
import { DataSourceResponse } from './DataSourceResponse';

export type RequestHandler<
  TOptions extends DataSourceOptions = DataSourceOptions,
  TResult extends DataSourceResponse = DataSourceResponse
> = (options: TOptions) => Promise<TResult>;
