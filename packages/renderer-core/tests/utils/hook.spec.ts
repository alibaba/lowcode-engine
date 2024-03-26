import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEvent, createHookStore, type HookStore } from '../../src/utils/hook';

describe('event', () => {
  it("event's listener ops", () => {
    const event = useEvent();
    const fn = () => {};
    event.add(fn);

    expect(event.list().includes(fn)).toBeTruthy();

    event.remove(fn);

    expect(event.list().includes(fn)).toBeFalsy();

    event.add(fn);

    expect(event.list().includes(fn)).toBeTruthy();

    event.clear();

    expect(event.list().includes(fn)).toBeFalsy();
  });
});

describe('hooks', () => {
  let hookStore: HookStore;

  beforeEach(() => {
    hookStore = createHookStore();
  });

  it('should register hook successfully', () => {
    const fn = () => {};
    hookStore.hook('test', fn);

    expect(hookStore.getHooks('test')).toContain(fn);
  });

  it('should ignore empty hook', () => {
    hookStore.hook('', () => {});
    hookStore.hook(undefined as any, () => {});

    expect(hookStore.getHooks('')).toBeUndefined();
    expect(hookStore.getHooks(undefined as any)).toBeUndefined();
  });

  it('should ignore not function hook', () => {
    hookStore.hook('test', 1 as any);
    hookStore.hook('test', undefined as any);

    expect(hookStore.getHooks('test')).toBeUndefined();
  });

  it('should call registered hook', () => {
    const spy = vi.fn();

    hookStore.hook('test', spy);
    hookStore.call('test');

    expect(spy).toHaveBeenCalled();
  });

  it('callAsync: should sequential call registered async hook', async () => {
    let count = 0;
    const counts: number[] = [];
    const fn = async () => {
      counts.push(count++);
    };

    hookStore.hook('test', fn);
    hookStore.hook('test', fn);

    await hookStore.callAsync('test');

    expect(counts).toEqual([0, 1]);
  });

  it('callParallel: should parallel call registered async hook', async () => {
    let count = 0;

    const sleep = (delay: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    };

    hookStore.hook('test', () => {
      count++;
    });
    hookStore.hook('test', async () => {
      await sleep(500);
      count++;
    });
    hookStore.hook('test', async () => {
      await sleep(1000);
      expect(count).toBe(2);
    });

    await hookStore.callParallel('test');
  });

  it('should throw hook error', async () => {
    const error = new Error('Hook Error');
    hookStore.hook('test', () => {
      throw error;
    });
    expect(() => hookStore.call('test')).toThrow(error);
  });

  it('should return a self-removal function', async () => {
    const spy = vi.fn();
    const remove = hookStore.hook('test', spy);

    hookStore.call('test');

    expect(spy).toBeCalledTimes(1);

    remove();

    hookStore.call('test');

    expect(spy).toBeCalledTimes(1);
  });

  it('should clear removed hooks', () => {
    const result: number[] = [];

    const fn1 = () => result.push(1);
    const fn2 = () => result.push(2);

    hookStore.hook('test', fn1);
    hookStore.hook('test', fn2);
    hookStore.call('test');

    expect(result).toHaveLength(2);
    expect(result).toEqual([1, 2]);

    hookStore.remove('test', fn1);
    hookStore.call('test');

    expect(result).toHaveLength(3);
    expect(result).toEqual([1, 2, 2]);

    hookStore.remove('test');
    hookStore.call('test');

    expect(result).toHaveLength(3);
    expect(result).toEqual([1, 2, 2]);
  });

  it('should clear ops works', () => {
    hookStore.hook('test1', () => {});
    hookStore.hook('test2', () => {});

    expect(hookStore.getHooks('test1')).toHaveLength(1);
    expect(hookStore.getHooks('test2')).toHaveLength(1);

    hookStore.clear('test1');

    expect(hookStore.getHooks('test1')).toBeUndefined();
    expect(hookStore.getHooks('test2')).toHaveLength(1);

    hookStore.clear();

    expect(hookStore.getHooks('test1')).toBeUndefined();
    expect(hookStore.getHooks('test2')).toBeUndefined();
  });
});
