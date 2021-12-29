import { join } from 'path';
import parse from '../src';
import { IMaterializeOptions } from '../src/types';
import { getFromFixtures } from './helpers';

const multiExportedComptPath = getFromFixtures('multiple-exported-component');
const singleExportedComptPath = getFromFixtures('single-exported-component');
const tsComponent = getFromFixtures('ts-component');
const tsComponent2 = getFromFixtures('ts-component2');
const dtsComponent = getFromFixtures('dts-component');
const transpiledComponent = getFromFixtures('transpiled-component');
const withoutDisplayName = getFromFixtures('without-display-name');

test('materialize single exported component by local', async done => {
  const options: IMaterializeOptions = {
    entry: singleExportedComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('materialize multiple exported component by local', async done => {
  const options: IMaterializeOptions = {
    entry: multiExportedComptPath,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('ts component by local', async done => {
  const options: IMaterializeOptions = {
    entry: tsComponent,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('ts component 2 by local', async done => {
  const options: IMaterializeOptions = {
    entry: tsComponent2,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('rax component by local', async done => {
  const options: IMaterializeOptions = {
    entry: 'src/index.tsx',
    root: getFromFixtures('rax-component'),
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('d.ts component by local', async done => {
  const options: IMaterializeOptions = {
    entry: join(dtsComponent, 'src/index.jsx'),
    root: dtsComponent,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('transpiled component by local', async done => {
  const options: IMaterializeOptions = {
    entry: transpiledComponent,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});

test('without display name by local', async done => {
  const options: IMaterializeOptions = {
    entry: withoutDisplayName,
    accesser: 'local',
  };

  const actual = await parse(options);

  expect(actual).toMatchSnapshot();
  done();
});
