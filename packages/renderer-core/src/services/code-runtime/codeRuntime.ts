import {
  type PlainObject,
  type Spec,
  type EventDisposable,
  isJSExpression,
  isJSFunction,
} from '@alilc/lowcode-shared';
import { type ICodeScope, CodeScope } from './codeScope';
import { isNode } from '../../../../shared/src/utils/node';
import { mapValue } from '../../utils/value';
import { evaluate } from './evaluate';

export interface CodeRuntimeOptions<T extends PlainObject = PlainObject> {
  initScopeValue?: Partial<T>;
  parentScope?: ICodeScope;

  evalCodeFunction?: EvalCodeFunction;
}

export interface ICodeRuntime<T extends PlainObject = PlainObject> {
  getScope(): ICodeScope<T>;

  run<R = unknown>(code: string, scope?: ICodeScope): R | undefined;

  resolve(value: PlainObject): any;

  onResolve(handler: NodeResolverHandler): EventDisposable;

  createChild<V extends PlainObject = PlainObject>(
    options: Omit<CodeRuntimeOptions<V>, 'parentScope'>,
  ): ICodeRuntime<V>;
}

export type NodeResolverHandler = (node: Spec.JSNode) => Spec.JSNode | false | undefined;

let onResolveHandlers: NodeResolverHandler[] = [];

export type EvalCodeFunction = (code: string, scope: any) => any;

export class CodeRuntime<T extends PlainObject = PlainObject> implements ICodeRuntime<T> {
  private codeScope: ICodeScope<T>;

  private evalCodeFunction: EvalCodeFunction = evaluate;

  constructor(options: CodeRuntimeOptions<T> = {}) {
    if (options.evalCodeFunction) this.evalCodeFunction = options.evalCodeFunction;

    if (options.parentScope) {
      this.codeScope = options.parentScope.createChild<T>(options.initScopeValue ?? {});
    } else {
      this.codeScope = new CodeScope(options.initScopeValue ?? {});
    }
  }

  getScope() {
    return this.codeScope;
  }

  run<R = unknown>(code: string): R | undefined {
    if (!code) return undefined;

    try {
      const result = this.evalCodeFunction(code, this.codeScope.value);

      return result as R;
    } catch (err) {
      // todo replace logger
      console.error('eval error', code, this.codeScope.value, err);
      return undefined;
    }
  }

  resolve(data: PlainObject): any {
    if (onResolveHandlers.length > 0) {
      data = mapValue(data, isNode, (node: Spec.JSNode) => {
        let newNode: Spec.JSNode | false | undefined = node;

        for (const handler of onResolveHandlers) {
          newNode = handler(newNode as Spec.JSNode);
          if (newNode === false || typeof newNode === 'undefined') {
            break;
          }
        }

        return newNode;
      });
    }

    return mapValue(
      data,
      (data) => {
        return isJSExpression(data) || isJSFunction(data);
      },
      (node: Spec.JSExpression | Spec.JSFunction) => {
        return this.resolveExprOrFunction(node);
      },
    );
  }

  private resolveExprOrFunction(node: Spec.JSExpression | Spec.JSFunction) {
    const v = this.run(node.value) as any;

    if (typeof v === 'undefined' && node.mock) {
      return this.resolve(node.mock);
    }
    return v;
  }

  /**
   * 顺序执行 handler
   */
  onResolve(handler: NodeResolverHandler): EventDisposable {
    onResolveHandlers.push(handler);
    return () => {
      onResolveHandlers = onResolveHandlers.filter((h) => h !== handler);
    };
  }

  createChild<V extends PlainObject = PlainObject>(
    options?: Omit<CodeRuntimeOptions<V>, 'parentScope'>,
  ): ICodeRuntime<V> {
    return new CodeRuntime({
      initScopeValue: options?.initScopeValue,
      parentScope: this.codeScope,
      evalCodeFunction: options?.evalCodeFunction ?? this.evalCodeFunction,
    });
  }
}
