import {
  DataSource,
  IDataSourceEngine,
  IRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/build-success-types';
import sinon from 'sinon';

import { bindRuntimeContext, delay, MockContext } from '../../_helpers';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

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
  const ORDERS_ERROR_MSG =
    'the orders request should not fetch, please check the condition';

  const USER_DATA = {
    name: 'Alice',
    age: 18,
  };

  const fetchHandler = sinon.fake(async () => {
    await delay(100);
    return {
      data: USER_DATA,
    };
  });

  const context = new MockContext<Record<string, unknown>>(
    {},
    (ctx) => create(bindRuntimeContext(dataSource, ctx), ctx, {
      requestHandlersMap: {
        fetch: fetchHandler,
      },
    }),
    {
      recordError() {},
    },
  );

  const setState = sinon.spy(context, 'setState');
  // const recordError = sinon.spy(context, 'recordError');

  // 一开始应该是初始状态
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Initial);

  const loading = context.reloadDataSource();

  await clock.tickAsync(50);

  // 中间应该有 loading 态
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

  await clock.tickAsync(50);

  // 中间应该有 loading 态
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Error);

  await Promise.all([clock.runAllAsync(), loading]);

  // 最后 user 成功， orders 失败
  t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);
  t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Error);

  // 检查数据源的数据
  t.deepEqual(context.dataSourceMap.user.data, USER_DATA);
  t.is(context.dataSourceMap.user.error, undefined);
  t.regex(
    context.dataSourceMap.orders.error!.message,
    new RegExp(ORDERS_ERROR_MSG),
  );

  // 检查状态数据
  t.assert(setState.calledOnce);
  t.deepEqual(context.state.user, USER_DATA);

  // fetchHandler 应该被调用了 1 次
  t.assert(fetchHandler.calledOnce);

  // 检查调用参数

  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);

  // // 埋点应该也会被调用
  // t.assert(recordError.calledOnce);
  // t.snapshot(recordError.firstCall.args);
};

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
