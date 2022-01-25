import { remove } from 'fs-extra';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';

test('materialize react-color by online', async (done) => {
  const options: IMaterializeOptions = {
    entry: 'react-color@2.19.3',
    accesser: 'online',
  };

  const actual = await parse(options);
  expect(actual).toMatchSnapshot();
  done();
});

test('materialize mc-hello by online', async (done) => {
  const options: IMaterializeOptions = {
    entry: 'mc-hello@1.0.1',
    accesser: 'online',
  };

  const actual = await parse(options);
  expect(actual).toMatchSnapshot();
  done();
});

test('materialize rc-picker by online', async (done) => {
  const options: IMaterializeOptions = {
    entry: 'rc-picker@2.4.3',
    accesser: 'online',
  };

  const actual = await parse(options);
  expect(actual).toMatchSnapshot();
  done();
});

test('materialize online rax module by path & specify workDir', async (done) => {
  const tempDir = './test/temp';
  const options: IMaterializeOptions = {
    name: 'rax-view',
    version: '2.2.1',
    entry: './es/common/index.d.ts',
    accesser: 'online',
    dslType: 'rax',
    tempDir,
  };

  const actual = await parse(options);
  await remove(tempDir);
  expect(actual).toMatchSnapshot();
  done();
});
