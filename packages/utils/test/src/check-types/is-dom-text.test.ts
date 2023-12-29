import { isDOMText } from '../../../src/check-types/is-dom-text';

describe('isDOMText', () => {
  it('should return true when the input is a string', () => {
    const result = isDOMText('Hello World');
    expect(result).toBe(true);
  });

  it('should return false when the input is not a string', () => {
    const result = isDOMText(123);
    expect(result).toBe(false);
  });
});
