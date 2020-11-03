import { IScope } from '../types/core';
import { IScopeBindings, ScopeBindings } from './ScopeBindings';

class Scope implements IScope {
  static createRootScope(): IScope {
    return new Scope();
  }

  bindings?: IScopeBindings;

  constructor() {
    this.bindings = undefined;
  }

  createSubScope(ownIndentifiers: string[]): IScope {
    const originalScopeBindings = this.bindings;
    const newScopeBindings = new ScopeBindings(originalScopeBindings);
    ownIndentifiers.forEach((identifier) => {
      newScopeBindings.addBinding(identifier);
    });
    const newScope = new Scope();
    newScope.bindings = newScopeBindings;
    return newScope;
  }
}

export default Scope;
