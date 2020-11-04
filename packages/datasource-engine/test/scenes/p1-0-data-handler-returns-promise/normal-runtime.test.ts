import test, { ExecutionContext } from 'ava';
import sinon, { SinonFakeTimers } from 'sinon';

import { create } from '../../../src/runtime';

import { dataSource } from './_datasource-runtime';
import { normalScene } from './_macro-normal';

test.before((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock = sinon.useFakeTimers();
});

test.after((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock.restore();
});

test(normalScene, {
  create,
  dataSource,
});
