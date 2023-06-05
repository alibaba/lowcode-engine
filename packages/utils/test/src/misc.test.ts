import { shouldUseVariableSetter } from '../../src/misc';

it('shouldUseVariableSetter', () => {
  expect(shouldUseVariableSetter(false, true)).toBeFalsy();
  expect(shouldUseVariableSetter(true, true)).toBeTruthy();
  expect(shouldUseVariableSetter(true, false)).toBeTruthy();
  expect(shouldUseVariableSetter(undefined, false)).toBeFalsy();
  expect(shouldUseVariableSetter(undefined, true)).toBeTruthy();
});