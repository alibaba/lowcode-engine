import { uniqueId } from '../../src/unique-id';

test('uniqueId should return a unique id with prefix', () => {
  const id = uniqueId('test');
  expect(id.startsWith('test')).toBeTruthy();
});

test('uniqueId should return a unique id without prefix', () => {
  const id = uniqueId();
  expect(id).not.toBeFalsy();
});
