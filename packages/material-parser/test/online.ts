import test from 'ava';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';

const reactColorComponent = 'react-color';
const customComponent = 'mc-breadcrumb';

test('materialize react-color by online', async t => {
  const options: IMaterializeOptions = {
    entry: reactColorComponent,
    accesser: 'online',
  };

  const actual = await parse(options);
  t.snapshot(actual);
});

test('materialize custom breadcrumb by online', async t => {
  const options: IMaterializeOptions = {
    entry: customComponent,
    accesser: 'online',
  };

  const actual = await parse(options);
  t.snapshot(actual);
});
