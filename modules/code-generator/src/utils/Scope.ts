import { IScope } from '../types/core';
import { IScopeBindings, ScopeBindings } from './ScopeBindings';

export class Scope implements IScope {
  /**
   * 创建根部 Scope，根据需要被上溯的作用域链决定是否开启新的
   */
  static createRootScope(): IScope {
    return new Scope();
  }

  bindings?: IScopeBindings;

  constructor(public readonly parent: IScope | null = null) {
    this.bindings = undefined;
  }

  createSubScope(ownIdentifiers: string[]): IScope {
    const originalScopeBindings = this.bindings;
    const newScopeBindings = new ScopeBindings(originalScopeBindings);
    ownIdentifiers.forEach((identifier) => {
      newScopeBindings.addBinding(identifier);
    });
    const newScope = new Scope(this);
    newScope.bindings = newScopeBindings;
    return newScope;
  }
}
