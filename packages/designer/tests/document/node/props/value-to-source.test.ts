// @ts-nocheck
import '../../../fixtures/silent-console';
import { getSource, valueToSource } from '../../../../src/document/node/props/value-to-source';

it('valueToSource', () => {
  expect(valueToSource(1)).toMatchSnapshot();
  expect(valueToSource(true)).toMatchSnapshot();
  expect(valueToSource([])).toMatchSnapshot();
  expect(valueToSource([{ a: 1 }])).toMatchSnapshot();
  expect(valueToSource({ a: 1 })).toMatchSnapshot();
  expect(valueToSource(null)).toMatchSnapshot();
  expect(valueToSource(() => {})).toMatchSnapshot();
  expect(valueToSource(new Map())).toMatchSnapshot();
  expect(valueToSource(new Set())).toMatchSnapshot();
  expect(valueToSource(/haha/)).toMatchSnapshot();
  expect(valueToSource('hahah')).toMatchSnapshot();
  expect(valueToSource(Symbol('haha'))).toMatchSnapshot();
  expect(valueToSource()).toMatchSnapshot();
  expect(valueToSource(new Date(1607680998520))).toMatchSnapshot();
});

it('getSource', () => {
  expect(getSource({ __source: { a: 1 } })).toEqual({ a: 1 });
  expect(getSource()).toBe('');
  const value = { abc: 1 };
  getSource(value);
  expect(value).toHaveProperty('__source');
  expect(getSource(1)).toBe('1');
});
