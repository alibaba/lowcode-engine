import {
  DataSource,
  IDataSourceEngine,
  IRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/build-success-types';
import sinon from 'sinon';

import { MockContext } from '../../_helpers';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';

export const normalScene: Macro<[
  {
    create: (
      dataSource: any,
      ctx: IRuntimeContext,
      options: any
    ) => IDataSourceEngine;
    dataSource: RuntimeDataSource | DataSource;
  }
]> = async (
  t: ExecutionContext<{ clock: SinonFakeTimers }>,
  { create, dataSource },
) => {
  const { clock } = t.context;

  const URL_PARAMS = {
    name: 'Alice',
    age: '18',
  };

  const urlParamsHandler = sinon.fake(async () => {
    return URL_PARAMS; // TODO: 别的都是返回的套了一层 data 的，但是 urlParams 的为啥不一样？
  });

  const context = new MockContext<Record<string, unknown>>({}, (ctx) => create(dataSource, ctx, {
    requestHandlersMap: {
      urlParams: urlParamsHandler,
    },
  }));

  const setState = sinon.spy(context, 'setState');

  // 一开始应该是初始状态
  t.is(context.dataSourceMap.urlParams.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await Promise.all([clock.runAllAsync(), loading]);

  // 最后应该成功了，loaded 状态
  t.is(context.dataSourceMap.urlParams.status, RuntimeDataSourceStatus.Loaded);

  // 检查数据源的数据
  t.deepEqual(context.dataSourceMap.urlParams.data, URL_PARAMS);
  t.deepEqual(context.dataSourceMap.urlParams.error, undefined);

  // 检查状态数据
  t.assert(setState.calledOnce);
  t.deepEqual(context.state.urlParams, URL_PARAMS);

  // fetchHandler 应该被调用了一次
  t.assert(urlParamsHandler.calledOnce);

  // 检查调用参数 url 没有 options
  t.deepEqual(urlParamsHandler.firstCall.args, [context]);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
