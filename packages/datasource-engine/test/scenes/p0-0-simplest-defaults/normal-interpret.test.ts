import test, { ExecutionContext } from 'ava';
import sinon, { SinonFakeTimers } from 'sinon';

import { create } from '../../../src/interpret';

import { DATA_SOURCE_SCHEMA } from './_datasource-schema';
import { normalScene } from './_macro-normal';

test.before((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock = sinon.useFakeTimers();
});

test.after((t: ExecutionContext<{ clock: SinonFakeTimers }>) => {
  t.context.clock.restore();
});

test(normalScene, {
  create,
  dataSource: DATA_SOURCE_SCHEMA,
});
