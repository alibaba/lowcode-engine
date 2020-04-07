import { CompositeValue } from './value-type';

export interface DataSourceConfig {
  id: string;
  isInit: boolean;
  type: string;
  options: {
    uri: string;
    [option: string]: CompositeValue;
  };
  [otherKey: string]: CompositeValue;
}

export interface DataSource {
  items: DataSourceConfig[];
}
