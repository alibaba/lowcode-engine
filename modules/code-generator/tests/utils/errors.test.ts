import { getErrorMessage } from '../../src/utils/errors';

describe('getErrorMessage', () => {
  it('can deal normal error', () => {
    expect(getErrorMessage(new Error('test'))).toBe('test');
  });

  it('can deal error object with message field', () => {
    expect(getErrorMessage({ message: 'test' })).toBe('test');
  });

  it('can deal null', () => {
    expect(getErrorMessage(null)).toBe(null);
  });

  it('can deal string', () => {
    expect(getErrorMessage('test')).toBe('test');
  });

  it('can deal error object with detail', () => {
    expect(getErrorMessage({ detail: 'test' })).toBe('test');
  });

  it('can deal error object with errorMessage', () => {
    expect(getErrorMessage({ errorMessage: 'test' })).toBe('test');
  });
});
