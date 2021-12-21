import { calcCompatibleVersion } from '../../src/utils/version';

const NO_COMPATIBLE_VERSIONS = /no compatible versions/;

test.each([
  ['*', '*', '*'],
  ['1.0.0', '1.0.0', '1.0.0'],
  ['^1.0.0', '^1.0.0', '^1.0.0'],
  ['*', undefined, '*'],
  [undefined, undefined, '*'],
  ['^1.0.0', undefined, '^1.0.0'],
  ['*', '^1.0.0', '^1.0.0'],
  ['^1.0.0', '^1.0.2', '^1.0.2'],
  ['^1.2.0', '^1.1.2', '^1.2.0'],
  ['^1.0.0', '1.0.2', '1.0.2'],
])('calc compatible versions "%i" & "%i" should be "%i"', (a, b, expected) => {
  expect(calcCompatibleVersion(a, b)).toBe(expected);
  expect(calcCompatibleVersion(b, a)).toBe(expected); // 应该满足交换律
});

test.each([
  ['^0.2.0', '^0.1.2', NO_COMPATIBLE_VERSIONS],
  ['>0.2.0', '^0.1.2', NO_COMPATIBLE_VERSIONS],
  ['1.0.1', '1.0.2', NO_COMPATIBLE_VERSIONS],
])('calc compatible versions "%i" & "%i" should be no compatible versions', (a, b, expected) => {
  expect(() => {
    calcCompatibleVersion(a, b);
  }).toThrow(expected);

  expect(() => {
    calcCompatibleVersion(b, a); // 应该满足交换律
  }).toThrow(expected);
});
