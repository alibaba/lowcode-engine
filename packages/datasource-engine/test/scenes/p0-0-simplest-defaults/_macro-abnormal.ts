import {
  DataSource,
  IDataSourceEngine,
  IRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/build-success-types';
import sinon from 'sinon';

import { delay, MockContext } from '../../_helpers';
// import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';

export const abnormalScene: Macro<[
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
  const ERROR_MSG = 'test error';
  const fetchHandler = sinon.fake(async () => {
    await delay(100);
    throw new Error(ERROR_MSG);
  });

  const context = new MockContext<Record<string, unknown>>({}, (ctx) => create(dataSource, ctx, {
    requestHandlersMap: {
      fetch: fetchHandler,
    },
  }));

  const setState = sinon.spy(context, 'setState');

  // 一开始应该是初始状态
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await clock.tickAsync(50);

  // 中间应该有 loading 态
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

  await Promise.all([clock.runAllAsync(), loading]);

  // 最后应该失败了，error 状态
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Error);

  // 检查数据源的数据
  t.deepEqual(context.dataSourceMap.user.data, undefined);
  t.not(context.dataSourceMap.user.error, undefined);
  t.regex(context.dataSourceMap.user.error!.message, new RegExp(ERROR_MSG));

  // 检查状态数据
  t.assert(setState.notCalled);
  t.deepEqual(context.state.user, undefined);

  // fetchHandler 不应该被调
  t.assert(fetchHandler.calledOnce);
};

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
