import { type PlainObject } from '@alilc/lowcode-shared';

export interface ICodeScope {
  readonly value: PlainObject;

  inject(name: string, value: any, force?: boolean): void;
  setValue(value: PlainObject, replace?: boolean): void;
  createChild(initValue: PlainObject): ICodeScope;
}

/**
 * 双链表实现父域值的获取
 */
interface IScopeNode {
  prev?: IScopeNode;
  current: PlainObject;
  next?: IScopeNode;
}

export class CodeScope implements ICodeScope {
  __node: IScopeNode;

  private proxyValue: PlainObject;

  constructor(initValue: PlainObject) {
    this.__node = {
      current: initValue,
    };

    this.proxyValue = new Proxy(Object.create(null) as PlainObject, {
      set(target, p, newValue, receiver) {
        return Reflect.set(target, p, newValue, receiver);
      },
      get: (target, p, receiver) => {
        let valueTarget: IScopeNode | undefined = this.__node;

        while (valueTarget) {
          if (Reflect.has(valueTarget.current, p)) {
            return Reflect.get(valueTarget.current, p, receiver);
          }
          valueTarget = this.__node.prev;
        }

        return Reflect.get(target, p, receiver);
      },
    });
  }

  get value() {
    return this.proxyValue;
  }

  inject(name: string, value: any, force = false): void {
    if (this.__node.current[name] && !force) {
      return;
    }
    this.__node.current.value[name] = value;
  }

  setValue(value: PlainObject, replace = false) {
    if (replace) {
      this.__node.current = { ...value };
    } else {
      this.__node.current = Object.assign({}, this.__node.current, value);
    }
  }

  createChild(initValue: PlainObject): ICodeScope {
    const subScope = new CodeScope(initValue);
    subScope.__node.prev = this.__node;

    return subScope as ICodeScope;
  }
}
