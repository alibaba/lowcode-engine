import { RequestHandler } from './RequestHandler';

export type DataSourceEngineOptions = {
  requestHandlersMap?: {
    [dataSourceType: string]: RequestHandler;
  };
};
