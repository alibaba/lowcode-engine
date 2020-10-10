import {
  transformFunction,
  getRuntimeValueFromConfig,
  getRuntimeJsValue,
  buildOptions,
  buildShouldFetch,
} from './../utils';
// 将不同渠道给的 schema 转为 runtime 需要的类型

import {
  DataSource,
  IPageContext,
  DataSourceConfig,
  RuntimeDataSourceConfig,
  DataSourceMap,
} from '@ali/build-success-types';
import { defaultDataHandler, defaultWillFetch } from '../helpers';

const adapt2Runtime = (dataSource: DataSource, context: IPageContext) => {
  const {
    list: interpretConfigList,
    dataHandler: interpretDataHandler,
  } = dataSource;
  const dataHandler: (dataMap?: DataSourceMap) => void =
    interpretDataHandler &&
    interpretDataHandler.compiled &&
    transformFunction(interpretDataHandler.compiled, context);

  // 为空判断
  if (!interpretConfigList || !interpretConfigList.length) {
    return {
      list: [],
      dataHandler,
    };
  }
  const list: RuntimeDataSourceConfig[] = interpretConfigList.map(
    (el: DataSourceConfig) => {
      return {
        id: el.id,
        isInit:
          getRuntimeValueFromConfig('boolean', el.isInit, context) || true, // 默认 true
        isSync:
          getRuntimeValueFromConfig('boolean', el.isSync, context) || false, // 默认 false
        type: el.type || 'fetch',
        willFetch: el.willFetch
          ? getRuntimeJsValue(el.willFetch, context)
          : defaultWillFetch,
        shouldFetch: buildShouldFetch(el, context),
        dataHandler: el.dataHandler
          ? getRuntimeJsValue(el.dataHandler, context)
          : defaultDataHandler,
        errorHandler: el.errorHandler
          ? getRuntimeJsValue(el.errorHandler, context)
          : undefined,
        options: buildOptions(el, context),
      };
    },
  );

  return {
    list,
    dataHandler,
  };
};

export { adapt2Runtime };
