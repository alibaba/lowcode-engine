import test from 'ava';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');
const fusionComptPath = getFromFixtures('fusion-next-component');
const singleExportedComponent = '@ali/demo-biz-test090702@0.0.2';
const multipleExportedComponent = '@ali/aimake-basic@0.1.0';
const tsComponent = getFromFixtures('ts-component');

test('materialize single exported component by local', async t => {
  const options: IMaterializeOptions = {
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});

test('materialize multiple exported component by local', async t => {
  const options: IMaterializeOptions = {
    cwd: multiExportedComptPath,
    entry: multiExportedComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});

test('materialize single exported component by online', async t => {
  const options: IMaterializeOptions = {
    entry: singleExportedComponent,
    accesser: 'online',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});

test('materialize multiple exported component by online', async t => {
  const options: IMaterializeOptions = {
    entry: multipleExportedComponent,
    accesser: 'online',
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

// test('fusion next component by local', async t => {
//   const options: IMaterializeOptions = {
//     entry: fusionComptPath,
//     accesser: 'local',
//   };

//   const actual = await parse(options);

//   t.snapshot(actual);
// });