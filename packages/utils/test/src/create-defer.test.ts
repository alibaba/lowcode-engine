import { createDefer } from '../../src/create-defer';

describe('createDefer', () => {
  it('should resolve with given value', async () => {
    const defer = createDefer<number>();
    defer.resolve(42);
    const result = await defer.promise();
    expect(result).toBe(42);
  });

  it('should reject with given reason', async () => {
    const defer = createDefer<number>();
    defer.reject('error');
    await expect(defer.promise()).rejects.toEqual('error');
  });
});
