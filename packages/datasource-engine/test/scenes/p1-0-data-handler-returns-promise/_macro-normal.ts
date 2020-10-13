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

export const normalScene: Macro<[
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
      name: 'Alice',
      age: 18,
    };

    const fetchHandler = sinon.fake(async () => {
      await delay(100);
      return {
        data: {
          success: true,
          data: USER_DATA,
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
        recordError() { },
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

    // 埋点不应该被调用
    t.assert(recordError.notCalled);
  };

normalScene.title = (providedTitle) => providedTitle || 'normal scene';
