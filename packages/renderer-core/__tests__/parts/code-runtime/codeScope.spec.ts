import { describe, it, expect, beforeAll } from 'vitest';
import { ICodeScope, CodeScope } from '../../../src/parts/code-runtime';

describe('codeScope', () => {
  let scope: ICodeScope;

  beforeAll(() => {
    scope = new CodeScope({});
  });

  it('should inject a new value', () => {
    scope.inject('username', 'Alice');
    expect(scope.value).toEqual({ username: 'Alice' });
  });

  it('should not overwrite an existing value without force', () => {
    scope.inject('username', 'Bob');
    expect(scope.value).toEqual({ username: 'Alice' });
  });

  it('should overwrite an existing value with force', () => {
    scope.inject('username', 'Bob', true);
    expect(scope.value).toEqual({ username: 'Bob' });
  });

  it('should set new value without replacing existing values', () => {
    scope.setValue({ age: 25 });
    expect(scope.value).toEqual({ username: 'Bob', age: 25 });
  });

  it('should set new value and replace all existing values', () => {
    scope.setValue({ loggedIn: true }, true);
    expect(scope.value).toEqual({ loggedIn: true });
  });

  it('should create a child scope with initial values', () => {
    const childScope = scope.createChild({ sessionId: 'abc123' });
    expect(childScope.value).toEqual({ loggedIn: true, sessionId: 'abc123' });
  });

  it('should set new values in the child scope without affecting the parent scope', () => {
    const childScope = scope.createChild({ theme: 'dark' });
    expect(childScope.value).toEqual({ loggedIn: true, sessionId: 'abc123', theme: 'dark' });
    expect(scope.value).toEqual({ loggedIn: true });
  });
});
