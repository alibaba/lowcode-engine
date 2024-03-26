import { describe, it, expect } from 'vitest';
import { nonSetterProxy } from '../../src/utils/non-setter-proxy';

describe('nonSetterProxy', () => {
  it('should non setter on proxy', () => {
    const target = { a: 1 };
    const proxy = nonSetterProxy(target);

    expect(() => ((proxy as any).b = 1)).toThrowError(/trap returned falsish for property 'b'/);
  });

  it('should correct value when getter', () => {
    const target = { a: 1 };
    const proxy = nonSetterProxy(target);

    expect(proxy.a).toBe(1);
    expect('a' in proxy).toBeTruthy();
  });
});
