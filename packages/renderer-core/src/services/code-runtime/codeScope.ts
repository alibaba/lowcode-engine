import { type PlainObject } from '@alilc/lowcode-shared';
import { trustedGlobals } from '../../utils/globals-es2015';

/*
 * variables who are impossible to be overwritten need to be escaped from proxy scope for performance reasons
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables
 */
const unscopables = trustedGlobals.reduce((acc, key) => ({ ...acc, [key]: true }), {
  __proto__: null,
});

export interface ICodeScope {
  readonly value: PlainObject;
  set(name: string, value: any): void;
  setValue(value: PlainObject, replace?: boolean): void;
  createChild(initValue: PlainObject): ICodeScope;
}

/**
 * 双链表实现父域值的获取
 */
interface IScopeNode {
  parent?: IScopeNode;
  current: PlainObject;
}

export class CodeScope implements ICodeScope {
  __node: IScopeNode;

  private proxyValue: PlainObject;

  constructor(initValue: PlainObject) {
    this.__node = {
      current: initValue,
    };

    this.proxyValue = this.createProxy();
  }

  get value() {
    return this.proxyValue;
  }

  set(name: string, value: any): void {
    this.__node.current[name] = value;
  }

  setValue(value: PlainObject, replace = false) {
    if (replace) {
      this.__node.current = { ...value };
    } else {
      this.__node.current = Object.assign({}, this.__node.current, value);
    }
  }

  createChild(initValue: PlainObject): ICodeScope {
    const childScope = new CodeScope(initValue);
    childScope.__node.parent = this.__node;

    return childScope;
  }

  private createProxy(): PlainObject {
    return new Proxy(Object.create(null) as PlainObject, {
      set: (target, p, newValue) => {
        this.set(p as string, newValue, true);
        return true;
      },
      get: (_, p) => this.findValue(p) ?? undefined,
      has: (_, p) => this.hasProperty(p),
    });
  }

  private findValue(prop: PropertyKey) {
    if (prop === Symbol.unscopables) return unscopables;

    let node: IScopeNode | undefined = this.__node;
    while (node) {
      if (Object.hasOwnProperty.call(node.current, prop)) {
        return node.current[prop as string];
      }
      node = node.parent;
    }
  }

  private hasProperty(prop: PropertyKey): boolean {
    if (prop in unscopables) return true;

    let node: IScopeNode | undefined = this.__node;
    while (node) {
      if (prop in node.current) {
        return true;
      }
      node = node.parent;
    }

    return false;
  }
}
