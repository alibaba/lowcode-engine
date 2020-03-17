import test from 'ava';
import LocalAccesser from '../../src/accesser/LocalAccesser';
import { IMaterializeOptions } from '../../src/types';
import { getFromFixtures } from '../helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');

test.serial('access single exported component by local', async t => {
  const options: IMaterializeOptions = {
    entry: singleExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: false,
  };
  const accesser = new LocalAccesser(options);
  const actual = await accesser.access();
  t.snapshot(actual);
});

// test.serial('access multiple exported component by local', async t => {
//   const options: IMaterializeOptions = {
//     entry: multiExportedComptPath,
//     accesser: 'local',
//     isExportedAsMultiple: true,
//   };
//   const accesser = new LocalAccesser(options);
//   const actual = await accesser.access();
//   t.snapshot(actual);
// });
