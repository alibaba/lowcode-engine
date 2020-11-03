import {
  InterpretDataSource,
  IDataSourceEngine,
  IDataSourceRuntimeContext,
  RuntimeDataSource,
  RuntimeDataSourceStatus,
} from '@ali/lowcode-types';
import sinon from 'sinon';

import { delay, MockContext } from '../../_helpers';
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

    // 注意 error 是会被吃掉了，还是 loaded 状态
    // FIXME:  根据协议内容，dataHandler 返回的结果是需要抛出错误的，那么 fetchHandler 的错误难道不需要处理？
    // TODO: 提案：request 如果挂了，不应该需要走 dataHandler 了，没有意义
    t.is(context.dataSourceMap.user.status, RuntimeDataSourceStatus.Error);

    // 检查数据源的数据
    t.deepEqual(context.dataSourceMap.user.data, undefined);
    t.not(context.dataSourceMap.user.error, undefined);
    t.regex(context.dataSourceMap.user.error!.message, new RegExp(ERROR_MSG));

    // 检查状态数据
    t.assert(setState.notCalled);

    // fetchHandler 应该没调
    t.assert.skip(fetchHandler.notCalled);

    // 检查调用参数
    const firstListItemOptions = DATA_SOURCE_SCHEMA.list[0].options;
    const fetchHandlerCallArgs = fetchHandler.firstCall.args[0];
    t.is(firstListItemOptions.uri, fetchHandlerCallArgs.uri);
  };

abnormalScene.title = (providedTitle) => providedTitle || 'abnormal scene';
