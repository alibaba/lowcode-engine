import {
  CompositeValue,
  JSExpression,
  JSFunction,
  JSONObject,
} from './value-type';

/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface InterpretDataSource {
  list: InterpretDataSourceConfig[];
  dataHandler?: JSFunction;
}

/**
 * 数据源对象
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface InterpretDataSourceConfig {
  id: string;
  isInit?: boolean | JSExpression;
  isSync?: boolean | JSExpression;
  type?: string;
  requestHandler?: JSFunction;
  dataHandler?: JSFunction;
  errorHandler?: JSFunction;
  willFetch?: JSFunction;
  shouldFetch?: JSFunction;
  options?: {
    uri: string | JSExpression;
    api?: string | JSExpression; // 兼容
    params?: JSONObject | JSExpression;
    method?: string | JSExpression;
    isCors?: boolean | JSExpression;
    timeout?: number | JSExpression;
    headers?: JSONObject | JSExpression;
    [option: string]: CompositeValue;
  };
  [otherKey: string]: CompositeValue;
}
