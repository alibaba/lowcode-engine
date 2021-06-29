// @ts-nocheck
import { invariant } from '../../src/utils/invariant';

it('invariant', () => {
  expect(() => invariant(true)).not.toThrow();
  expect(() => invariant(false, 'abc', 'xxx')).toThrow(/Invariant failed:/);
});