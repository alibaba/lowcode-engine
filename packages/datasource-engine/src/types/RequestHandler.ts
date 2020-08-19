import { DataSourceOptions } from './DataSourceOptions';

export type RequestHandler<
  TOptions extends DataSourceOptions = DataSourceOptions,
  TResult = unknown
> = (options: TOptions) => Promise<TResult>;
