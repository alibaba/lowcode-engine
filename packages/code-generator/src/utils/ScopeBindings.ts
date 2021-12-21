import { OrderedSet } from './OrderedSet';

export interface IScopeBindings {
  readonly parent: IScopeBindings | null;

  hasBinding: (varName: string) => boolean;
  hasOwnBinding: (varName: string) => boolean;

  addBinding: (varName: string) => void;
  removeBinding: (varName: string) => void;

  getAllBindings: () => string[];
  getAllOwnedBindings: () => string[];
}

export class ScopeBindings implements IScopeBindings {
  readonly parent: IScopeBindings | null;

  private _bindings = new OrderedSet<string>();

  constructor(p: IScopeBindings | null = null) {
    this.parent = p;
  }

  hasBinding(varName: string): boolean {
    return this._bindings.has(varName) || !!this.parent?.hasBinding(varName);
  }

  hasOwnBinding(varName: string): boolean {
    return this._bindings.has(varName);
  }

  addBinding(varName: string): void {
    this._bindings.add(varName);
  }

  removeBinding(varName: string): void {
    this._bindings.delete(varName);
  }

  getAllBindings(): string[] {
    const allBindings = new OrderedSet(this._bindings.toArray());

    for (let { parent } = this; parent; parent = parent?.parent) {
      parent.getAllOwnedBindings().forEach((varName) => {
        allBindings.add(varName);
      });
    }

    return allBindings.toArray();
  }

  getAllOwnedBindings(): string[] {
    return this._bindings.toArray();
  }
}
