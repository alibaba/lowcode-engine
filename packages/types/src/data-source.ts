import { CompositeValue, JSExpression, JSFunction, JSONObject } from './value-type';

/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface DataSourceConfig {
  id: string;
  isInit: boolean | JSExpression;
  type: string;
  requestHandler?: JSFunction;
  dataHandler?: JSFunction;
  options: {
    uri: string | JSExpression;
    params?: JSONObject | JSExpression;
    method?: string | JSExpression;
    isCors?: boolean | JSExpression;
    timeout?: number | JSExpression;
    headers?: JSONObject | JSExpression;
    [option: string]: CompositeValue;
  };
  [otherKey: string]: CompositeValue;
}

/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface DataSource {
  list: DataSourceConfig[];
  dataHandler?: JSFunction;
}
