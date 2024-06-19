import { describe, it, expect } from 'vitest';
import { Barrier } from '../../src';

describe('Barrier', () => {
  it('waits for barrier to open', async () => {
    const barrier = new Barrier();

    setTimeout(() => {
      barrier.open();
    }, 500); // Simulate opening the barrier after 500ms

    const start = Date.now();
    await barrier.wait(); // Async operation should await here
    const duration = Date.now() - start;

    expect(barrier.isOpen()).toBeTruthy();
    expect(duration).toBeGreaterThanOrEqual(500); // Ensures we waited for at least 500ms
  });

  it('mutiple', async () => {
    let result = '';
    const b1 = new Barrier();
    const b2 = new Barrier();

    async function run1() {
      await b1.wait();
    }
    async function run2() {
      await b2.wait();
    }

    run1().then(() => {
      result += 1;
    });
    run1().finally(() => {
      result += 2;
    });

    run2().then(() => {
      result += 3;
    });
    run2().finally(() => {
      result += 4;
    });

    b1.open();

    await run1();

    b2.open();

    await run2();

    expect(result).toBe('1234');
  });
});
