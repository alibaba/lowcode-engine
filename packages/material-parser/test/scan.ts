import test from 'ava';
import scan from '../src/scan';
import { getFromFixtures } from './helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');

test.serial('scan multiple exported component', async t => {

  const actual = await scan({
    cwd: multiExportedComptPath,
    entry: multiExportedComptPath,
    accesser: 'local',
  });
  t.snapshot(actual);
});

test.serial('scan single exported component', async t => {

  const actual = await scan({
    cwd: singleExportedComptPath,
    entry: singleExportedComptPath,
    accesser: 'local',
  });
  t.snapshot(actual);
});
