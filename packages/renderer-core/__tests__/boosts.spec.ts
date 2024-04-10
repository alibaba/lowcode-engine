import { describe, expect, it } from 'vitest';
import { appBoosts } from '../src/boosts';

describe('appBoosts', () => {
  it('should add value successfully', () => {
    appBoosts.add('test', 1);
    expect(appBoosts.value.test).toBe(1);
  });

  it('should clear removed value', () => {
    appBoosts.add('test', 1);
    expect(appBoosts.value.test).toBe(1);

    appBoosts.remove('test');
    expect(appBoosts.value.test).toBeUndefined();
  });
});
