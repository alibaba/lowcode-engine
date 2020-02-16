import test from 'ava';
import Materialize from '../src/Materialize';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');
const singleExportedComponent = '@ali/demo-biz-test090702@0.0.2';
const multipleExportedComponent = '@ali/aimake-basic@0.1.0';

test('materialize single exported component by local', async t => {
  const options: IMaterializeOptions = {
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: false,
  };

  const instance = new Materialize(options);
  const actual = await instance.start();

  t.snapshot(actual);
});

test('materialize multiple exported component by local', async t => {
  const options: IMaterializeOptions = {
    cwd: multiExportedComptPath,
    entry: multiExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: true,
  };

  const instance = new Materialize(options);
  const actual = await instance.start();

  t.snapshot(actual);
});

// test('materialize single exported component by online', async t => {
//   const options: IMaterializeOptions = {
//     entry: singleExportedComponent,
//     accesser: 'online',
//     isExportedAsMultiple: false,
//   };

//   const instance = new Materialize(options);
//   const actual = await instance.start();

//   t.snapshot(actual);
// });

// test('materialize multiple exported component by online', async t => {
//   const options: IMaterializeOptions = {
//     entry: multipleExportedComponent,
//     accesser: 'online',
//     isExportedAsMultiple: false,
//   };

//   const instance = new Materialize(options);
//   const actual = await instance.start();

//   t.snapshot(actual);
// });
