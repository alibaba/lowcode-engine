import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from '../../src';

describe('hookable', () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('on', async () => {
    const spy = vi.fn();
    eventEmitter.on('test', spy);
    await eventEmitter.emit('test');

    expect(spy).toBeCalled();
  });

  it('prependListener', () => {
    // const spy = vi.fn();
    // expect(spy).toC
  });
});
