import test, { ExecutionContext } from 'ava';
import sinon from 'sinon';

import { create } from '../../../src/interpret';
import { DATA_SOURCE_SCHEMA } from './_datasource-schema';
import { abnormalScene } from './_macro-abnormal';

import type { SinonFakeTimers } from 'sinon';

test.before((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock = sinon.useFakeTimers();
});

test.after((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock.restore();
});

test(abnormalScene, {
  create,
  dataSource: DATA_SOURCE_SCHEMA,
});
