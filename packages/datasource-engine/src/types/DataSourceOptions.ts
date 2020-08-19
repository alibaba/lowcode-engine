export type DataSourceOptions<TParams = Record<string, unknown>> = {
  uri?: string;
  params?: TParams;
  method?: string;
  isCors?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
  isSync?: boolean;
  [key: string]: unknown;
};
