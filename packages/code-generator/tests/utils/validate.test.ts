import { isValidIdentifier } from '../../src/utils/validate';
describe('utils/validate', () => {
  it('isValidIdentifier should works for normal identifiers', () => {
    expect(isValidIdentifier('foo')).toBeTruthy();
    expect(isValidIdentifier('bar')).toBeTruthy();
    expect(isValidIdentifier('hello123')).toBeTruthy();
    expect(isValidIdentifier('helloWorld123')).toBeTruthy();
    expect(isValidIdentifier('hello_world123')).toBeTruthy();
    expect(isValidIdentifier('$hello_world123')).toBeTruthy();
    expect(isValidIdentifier('姓名')).toBeTruthy();
    expect(isValidIdentifier('电话号码')).toBeTruthy();
  });

  it('isValidIdentifier should works for invalid identifiers', () => {
    expect(isValidIdentifier('ak dak')).toBeFalsy();
    expect(isValidIdentifier('姓名 电话')).toBeFalsy();
    expect(isValidIdentifier('123akk')).toBeFalsy();
    expect(isValidIdentifier('a,b')).toBeFalsy();
  });
});
