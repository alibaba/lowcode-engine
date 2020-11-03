import test, { ExecutionContext } from 'ava';
import sinon, { SinonFakeTimers } from 'sinon';

import { create } from '../../../src/runtime';

import { dataSource } from './_datasource-runtime';
import { abnormalScene } from './_macro-abnormal';

test.before((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock = sinon.useFakeTimers();
});

test.after((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock.restore();
});

test(abnormalScene, {
  create,
  dataSource,
});
