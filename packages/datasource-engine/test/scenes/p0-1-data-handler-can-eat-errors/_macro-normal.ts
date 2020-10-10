import {
  DataSource,
  IDataSourceEngine,
  IRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/build-success-types';
import sinon from 'sinon';

import { delay, MockContext } from '../../_helpers';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

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

  const USER_DATA = {
    name: 'Alice',
    age: 18,
  };

  const fetchHandler = sinon.fake(async () => {
    await delay(100);
    return { data: USER_DATA };
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

  // 最后应该成功了，loaded 状态
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);

  // 检查数据源的数据
  t.deepEqual(context.dataSourceMap.user.data, USER_DATA);
  t.deepEqual(context.dataSourceMap.user.error, undefined);

  // 检查状态数据
  t.assert(setState.calledOnce);
  t.deepEqual(context.state.user, USER_DATA);

  // fetchHandler 应该被调用了一次
  t.assert(fetchHandler.calledOnce);

  // 检查调用参数
  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
