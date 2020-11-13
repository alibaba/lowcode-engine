import '../fixtures/disable-raf';
import { throttle } from '../../src/builtin-simulator/utils/throttle';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cb = jest.fn();

describe('throttle', () => {
  it('simple', async () => {
    const fn = throttle(cb, 1000);
    fn();

    expect(cb).toBeCalledTimes(1);

    await delay(200);
    fn();

    await delay(400);
    fn();
    expect(cb).toBeCalledTimes(1);
  });
});