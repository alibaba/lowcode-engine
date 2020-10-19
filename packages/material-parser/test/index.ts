import test from 'ava';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');
const tsComponent = getFromFixtures('ts-component');
const tsComponent2 = getFromFixtures('ts-component2');

test('materialize single exported component by local', async t => {
  const options: IMaterializeOptions = {
    entry: singleExportedComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});

test('materialize multiple exported component by local', async t => {
  const options: IMaterializeOptions = {
    entry: multiExportedComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});

test('ts component by local', async t => {
  const options: IMaterializeOptions = {
    entry: tsComponent,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});

test('ts component 2 by local', async t => {
  const options: IMaterializeOptions = {
    entry: tsComponent2,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});
