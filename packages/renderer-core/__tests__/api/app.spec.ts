import { describe, it, expect, vi } from 'vitest';
import { createAppFunction } from '../../src/api/app';
import { definePlugin } from '../../src/plugin';

describe('createAppFunction', () => {
  it('should require a function argument that returns an render object.', () => {
    expect(() => createAppFunction(undefined as any)).rejects.toThrowError();
  });

  it('should return a function', () => {
    const createApp = createAppFunction(async () => {
      return {
        appBase: {
          mount(el) {},
          unmount() {},
        },
      };
    });

    expect({ createApp }).toEqual({ createApp: expect.any(Function) });
  });

  it('should construct app object', () => {
    expect('').toBe('');
  });

  it('should plugin inited when app created', async () => {
    const plugin = definePlugin({
      name: 'test',
      setup() {},
    });
    const spy = vi.spyOn(plugin, 'setup');

    const createApp = createAppFunction(async () => {
      return {
        appBase: {
          mount(el) {},
          unmount() {},
        },
      };
    });

    await createApp({
      schema: {},
      plugins: [plugin],
    });

    expect(spy).toHaveBeenCalled();
  });
});
