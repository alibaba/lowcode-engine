import { describe, it, expect } from 'vitest';
import { CodeScope } from '../../../src/parts/code-runtime';

describe('CodeScope', () => {
  it('should return initial values', () => {
    const initValue = { a: 1, b: 2 };
    const scope = new CodeScope(initValue);
    expect(scope.value.a).toBe(1);
    expect(scope.value.b).toBe(2);
  });

  it('inject should add new values', () => {
    const scope = new CodeScope({});
    scope.set('c', 3);
    expect(scope.value.c).toBe(3);
  });

  it('inject should not overwrite existing values without force', () => {
    const initValue = { a: 1 };
    const scope = new CodeScope(initValue);
    scope.set('a', 2);
    expect(scope.value.a).toBe(1);
    scope.set('a', 3, true);
    expect(scope.value.a).toBe(3);
  });

  it('setValue should merge values by default', () => {
    const initValue = { a: 1 };
    const scope = new CodeScope(initValue);
    scope.setValue({ b: 2 });
    expect(scope.value.a).toBe(1);
    expect(scope.value.b).toBe(2);
  });

  it('setValue should replace values when replace is true', () => {
    const initValue = { a: 1 };
    const scope = new CodeScope(initValue);
    scope.setValue({ b: 2 }, true);
    expect(scope.value.a).toBeUndefined();
    expect(scope.value.b).toBe(2);
  });

  it('should create child scopes and respect scope hierarchy', () => {
    const parentValue = { a: 1, b: 2 };
    const childValue = { b: 3, c: 4 };

    const parentScope = new CodeScope(parentValue);
    const childScope = parentScope.createChild(childValue);

    expect(childScope.value.a).toBe(1); // Inherits from parent scope
    expect(childScope.value.b).toBe(3); // Overridden by child scope
    expect(childScope.value.c).toBe(4); // Unique to child scope
    expect(parentScope.value.c).toBeUndefined(); // Parent scope should not have child's properties
  });
});
