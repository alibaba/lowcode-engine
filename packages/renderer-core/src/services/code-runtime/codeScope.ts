import { type PlainObject } from '@alilc/lowcode-shared';
import { trustedGlobals } from './globals-es2015';

/*
 * variables who are impossible to be overwritten need to be escaped from proxy scope for performance reasons
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables
 */
const unscopables = trustedGlobals.reduce((acc, key) => ({ ...acc, [key]: true }), {
  __proto__: null,
});

export interface ICodeScope<T extends PlainObject = PlainObject> {
  readonly value: T;

  set(name: keyof T, value: any): void;
  setValue(value: Partial<T>, replace?: boolean): void;
  createChild<V extends PlainObject = PlainObject>(initValue: Partial<V>): ICodeScope<V>;
}

/**
 * 双链表实现父域值的获取
 */
interface IScopeNode<T extends PlainObject> {
  parent?: IScopeNode<PlainObject>;
  current: Partial<T>;
}

export class CodeScope<T extends PlainObject = PlainObject> implements ICodeScope<T> {
  __node: IScopeNode<T>;

  private proxyValue: T;

  constructor(initValue: Partial<T>) {
    this.__node = {
      current: initValue,
    };

    this.proxyValue = this.createProxy();
  }

  get value(): T {
    return this.proxyValue;
  }

  set(name: keyof T, value: any): void {
    this.__node.current[name] = value;
  }

  setValue(value: Partial<T>, replace = false) {
    if (replace) {
      this.__node.current = { ...value };
    } else {
      this.__node.current = Object.assign({}, this.__node.current, value);
    }
  }

  createChild<V extends PlainObject = PlainObject>(initValue: Partial<V>): ICodeScope<V> {
    const childScope = new CodeScope(initValue);
    childScope.__node.parent = this.__node;

    return childScope;
  }

  private createProxy(): T {
    return new Proxy(Object.create(null) as T, {
      set: (target, p, newValue) => {
        this.set(p as string, newValue);
        return true;
      },
      get: (_, p) => this.findValue(p) ?? undefined,
      has: (_, p) => this.hasProperty(p),
    });
  }

  private findValue(prop: PropertyKey) {
    if (prop === Symbol.unscopables) return unscopables;

    let node: IScopeNode<PlainObject> | undefined = this.__node;
    while (node) {
      if (Object.hasOwnProperty.call(node.current, prop)) {
        return node.current[prop as string];
      }
      node = node.parent;
    }
  }

  private hasProperty(prop: PropertyKey): boolean {
    if (prop in unscopables) return true;

    let node: IScopeNode<PlainObject> | undefined = this.__node;
    while (node) {
      if (prop in node.current) {
        return true;
      }
      node = node.parent;
    }

    return false;
  }
}
