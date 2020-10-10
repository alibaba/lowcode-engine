import {
  DataSource,
  IDataSourceEngine,
  IRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/build-success-types';
import sinon from 'sinon';

import { bindRuntimeContext, delay, MockContext } from '../../_helpers';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

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
    return {
      data: {
        success: false,
        message: ERROR_MSG,
        code: 'E_FOO',
      },
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
  const recordError = sinon.spy(context, 'recordError');

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

  // fetchHandler 应该被调用了一次
  t.assert(fetchHandler.calledOnce);

  // 检查调用参数
  const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
  const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
  t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);

  // 埋点应该也会被调用
  t.assert(recordError.calledOnce);
  t.snapshot(recordError.firstCall.args);
};

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
