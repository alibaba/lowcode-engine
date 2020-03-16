import test from 'ava';
import ReactParser from '../../src/parser/ReactParser';
import Scanner from '../../src/scanner/Scanner';
import { IMaterializeOptions, IMaterialParsedModel } from '../../src/types';
import { getFromFixtures } from '../helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');

// test.serial('parse es6 multiple exported component by local', async t => {
//   const options: IMaterializeOptions = {
//     cwd: multiExportedComptPath,
//     entry: multiExportedComptPath,
//     accesser: 'local',
//     isExportedAsMultiple: true,
//   };

//   const scanner = new Scanner(options);
//   const scanModel = await scanner.scan();
//   const parser = new ReactParser(options);
//   const actual: IMaterialParsedModel[] = await parser.parse(scanModel);

//   t.snapshot(actual);
// });

test.serial('parse es6 single exported component by local', async t => {
  const options: IMaterializeOptions = {
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: false,
  };

  const scanner = new Scanner(options);
  const scanModel = await scanner.scan();
  const parser = new ReactParser(options);
  const actual: IMaterialParsedModel[] = await parser.parse(scanModel);

  t.snapshot(actual);
});
