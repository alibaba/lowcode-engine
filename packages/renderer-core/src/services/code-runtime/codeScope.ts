import {
  type StringDictionary,
  Disposable,
  type IDisposable,
  LinkedListNode,
} from '@alilc/lowcode-shared';
import { trustedGlobals } from './globals-es2015';

/*
 * variables who are impossible to be overwritten need to be escaped from proxy scope for performance reasons
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables
 */
const unscopables = trustedGlobals.reduce((acc, key) => ({ ...acc, [key]: true }), {
  __proto__: null,
});

export interface ICodeScope<T extends StringDictionary = StringDictionary> extends IDisposable {
  readonly value: T;

  set(name: keyof T, value: any): void;

  setValue(value: Partial<T>, replace?: boolean): void;

  createChild<V extends StringDictionary = StringDictionary>(initValue: Partial<V>): ICodeScope<V>;

  dispose(): void;
}

export class CodeScope<T extends StringDictionary = StringDictionary>
  extends Disposable
  implements ICodeScope<T>
{
  node = LinkedListNode.Undefined;

  private _proxyValue?: T;

  constructor(initValue: Partial<T>) {
    super();

    this.node.current = initValue;
  }

  get value(): T {
    this._throwIfDisposed('code scope has been disposed');

    if (!this._proxyValue) {
      this._proxyValue = this._createProxy();
    }
    return this._proxyValue;
  }

  set(name: keyof T, value: any): void {
    this._throwIfDisposed('code scope has been disposed');

    this.node.current[name] = value;
  }

  setValue(value: Partial<T>, replace = false) {
    this._throwIfDisposed('code scope has been disposed');

    if (replace) {
      this.node.current = { ...value };
    } else {
      this.node.current = Object.assign({}, this.node.current, value);
    }
  }

  createChild<V extends StringDictionary = StringDictionary>(initValue: Partial<V>): ICodeScope<V> {
    const childScope = this.addDispose(new CodeScope(initValue));
    childScope.node.prev = this.node;

    return childScope;
  }

  dispose(): void {
    super.dispose();
    this.node = LinkedListNode.Undefined;
    this._proxyValue = undefined;
  }

  private _createProxy(): T {
    return new Proxy(Object.create(null) as T, {
      set: (target, p, newValue) => {
        this.set(p as string, newValue);
        return true;
      },
      get: (_, p) => this._findValue(p) ?? undefined,
      has: (_, p) => this._hasProperty(p),
    });
  }

  private _findValue(prop: PropertyKey) {
    if (prop === Symbol.unscopables) return unscopables;

    let node = this.node;
    while (node) {
      if (Object.hasOwnProperty.call(node.current, prop)) {
        return node.current[prop as string];
      }
      node = node.prev;
    }
  }

  private _hasProperty(prop: PropertyKey): boolean {
    if (prop in unscopables) return true;

    let node = this.node;
    while (node) {
      if (prop in node.current) {
        return true;
      }
      node = node.prev;
    }

    return false;
  }
}
