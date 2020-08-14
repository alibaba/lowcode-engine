import test from 'ava';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const antdComptPath = getFromFixtures('antd-component');

test('antd component by local', async t => {
  const options: IMaterializeOptions = {
    entry: antdComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});