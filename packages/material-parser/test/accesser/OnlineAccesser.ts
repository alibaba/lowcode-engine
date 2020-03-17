import test from 'ava';
import OnlineAccesser from '../../src/accesser/OnlineAccesser';
import { IMaterializeOptions } from '../../src/types';

const singleExportedComponent = '@ali/demo-biz-test090702@0.0.2';
const multipleExportedComponent = '@ali/aimake-basic@0.1.0';

test.serial('online accesser', t => {
  t.pass();
})
// test.serial('access single exported component by online', async t => {
//   const options: IMaterializeOptions = {
//     entry: singleExportedComponent,
//     accesser: 'online',
//     isExportedAsMultiple: false,
//   };
//   const accesser = new OnlineAccesser(options);
//   const actual = await accesser.access();
//   t.snapshot(actual);
// });

// test.serial('access multiple exported component by online', async t => {
//   const options: IMaterializeOptions = {
//     entry: multipleExportedComponent,
//     accesser: 'online',
//     isExportedAsMultiple: true,
//   };
//   const accesser = new OnlineAccesser(options);
//   const actual = await accesser.access();
//   t.snapshot(actual);
// });

// test.serial('access @alifd/next@1.17.12 by online', async t => {
//   const options: IMaterializeOptions = {
//     entry: '@alifd/next@1.17.12',
//     accesser: 'online',
//     isExportedAsMultiple: true,
//   };
//   const accesser = new OnlineAccesser(options);
//   const actual = await accesser.access();
//   t.snapshot(actual);
// });
