import {
  type StringDictionary,
  type JSNode,
  type EventDisposable,
  type JSExpression,
  type JSFunction,
  specTypes,
} from '@alilc/lowcode-shared';
import { type ICodeScope, CodeScope } from './codeScope';
import { isNode } from '../../../../shared/src/utils/node';
import { mapValue } from '../../utils/value';
import { evaluate } from './evaluate';

export interface CodeRuntimeOptions<T extends StringDictionary = StringDictionary> {
  initScopeValue?: Partial<T>;
  parentScope?: ICodeScope;

  evalCodeFunction?: EvalCodeFunction;
}

export interface ICodeRuntime<T extends StringDictionary = StringDictionary> {
  getScope(): ICodeScope<T>;

  run<R = unknown>(code: string, scope?: ICodeScope): R | undefined;

  resolve(value: StringDictionary): any;

  onResolve(handler: NodeResolverHandler): EventDisposable;

  createChild<V extends StringDictionary = StringDictionary>(
    options: Omit<CodeRuntimeOptions<V>, 'parentScope'>,
  ): ICodeRuntime<V>;
}

export type NodeResolverHandler = (node: JSNode) => JSNode | false | undefined;

let onResolveHandlers: NodeResolverHandler[] = [];

export type EvalCodeFunction = (code: string, scope: any) => any;

export class CodeRuntime<T extends StringDictionary = StringDictionary> implements ICodeRuntime<T> {
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

  resolve(data: StringDictionary): any {
    if (onResolveHandlers.length > 0) {
      data = mapValue(data, isNode, (node: JSNode) => {
        let newNode: JSNode | false | undefined = node;

        for (const handler of onResolveHandlers) {
          newNode = handler(newNode as JSNode);
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
        return specTypes.isJSExpression(data) || specTypes.isJSFunction(data);
      },
      (node: JSExpression | JSFunction) => {
        return this.resolveExprOrFunction(node);
      },
    );
  }

  private resolveExprOrFunction(node: JSExpression | JSFunction) {
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

  createChild<V extends StringDictionary = StringDictionary>(
    options?: Omit<CodeRuntimeOptions<V>, 'parentScope'>,
  ): ICodeRuntime<V> {
    return new CodeRuntime({
      initScopeValue: options?.initScopeValue,
      parentScope: this.codeScope,
      evalCodeFunction: options?.evalCodeFunction ?? this.evalCodeFunction,
    });
  }
}
