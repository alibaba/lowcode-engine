import test from 'ava';
import Scanner from '../../src/scanner/Scanner';
import { IMaterializeOptions } from '../../src/types';
import { getFromFixtures } from '../helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');

test.serial('scan multiple exported component', async t => {
  const scanner = new Scanner({
    cwd: multiExportedComptPath,
    entry: multiExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: true,
  } as IMaterializeOptions);

  const actual = await scanner.scan();
  t.snapshot(actual);
});

test.serial('scan single exported component', async t => {
  const scanner = new Scanner({
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
    isExportedAsMultiple: false,
  } as IMaterializeOptions);

  const actual = await scanner.scan();
  t.snapshot(actual);
});
