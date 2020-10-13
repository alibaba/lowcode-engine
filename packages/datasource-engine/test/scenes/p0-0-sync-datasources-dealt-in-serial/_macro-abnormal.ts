import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/lowcode-types';
import sinon from 'sinon';

import { bindRuntimeContext, delay, MockContext } from '../../_helpers';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';

import type { ExecutionContext, Macro } from 'ava';
import type { SinonFakeTimers } from 'sinon';

export const abnormalScene: Macro<[
  {
    create: (
      dataSource: any,
      ctx: IDataSourceRuntimeContext,
      options: any
    ) => IDataSourceEngine;
    dataSource: RuntimeDataSource | InterpretDataSource;
  }
]> = async (
  t: ExecutionContext<{ clock: SinonFakeTimers }>,
  { create, dataSource },
  ) => {
    const { clock } = t.context;

    const USER_DATA = {
      id: 9527,
      name: 'Alice',
    };
    const ERROR_MSG = 'test error';
    const fetchHandler = sinon.fake(async ({ uri }) => {
      await delay(100);
      if (/user/.test(uri)) {
        return { data: USER_DATA };
      } else {
        throw new Error(ERROR_MSG);
      }
    });

    const context = new MockContext<Record<string, unknown>>({}, (ctx) => create(bindRuntimeContext(dataSource, ctx), ctx, {
      requestHandlersMap: {
        fetch: fetchHandler,
      },
    }));

    const setState = sinon.spy(context, 'setState');

    // 一开始应该是初始状态
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Initial);
    t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Initial);

    const loading = context.reloadDataSource();

    await clock.tickAsync(50);

    // 中间应该有 loading 态
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loading);

    await clock.tickAsync(50);

    t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Loading);

    await Promise.all([clock.runAllAsync(), loading]);

    // 最后 user 应该成功了，loaded
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Loaded);
    // 最后 orders 应该失败了，error 状态
    t.is(context.dataSourceMap.orders.status, RuntimeDataSourceStatus.Error);

    // 检查数据源的数据
    t.deepEqual(context.dataSourceMap.user.data, USER_DATA);
    t.is(context.dataSourceMap.user.error, undefined);
    t.deepEqual(context.dataSourceMap.orders.data, undefined);
    t.not(context.dataSourceMap.orders.error, undefined);
    t.regex(context.dataSourceMap.orders.error!.message, new RegExp(ERROR_MSG));

    // 检查状态数据
    t.assert(setState.calledOnce);
    t.deepEqual(context.state.user, USER_DATA);
    t.is(context.state.orders, undefined);

    // fetchHandler 应该被调用了2次
    t.assert(fetchHandler.calledTwice);

    const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
    const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
    // 检查调用参数
    t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);
  };

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
