import test from 'ava';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const fusionComptPath = getFromFixtures('fusion-next-component');

test('fusion next component by local', async t => {
  const options: IMaterializeOptions = {
    entry: fusionComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  t.snapshot(actual);
});