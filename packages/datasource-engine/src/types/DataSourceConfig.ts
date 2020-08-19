import { DataSourceConfigItem } from './DataSourceConfigItem';

export type DataSourceConfig = {
  list?: DataSourceConfigItem[];
  dataHandler?: (dataMap: Record<string, unknown>) => void | Promise<void>;
};
