import {
  type StringDictionary,
  type JSNode,
  type IDisposable,
  type JSExpression,
  type JSFunction,
  specTypes,
  isNode,
  toDisposable,
  Disposable,
} from '@alilc/lowcode-shared';
import { type ICodeScope, CodeScope } from './codeScope';
import { mapValue } from './value';
import { evaluate } from './evaluate';

export interface CodeRuntimeOptions<T extends StringDictionary = StringDictionary> {
  initScopeValue?: Partial<T>;

  parentScope?: ICodeScope;

  evalCodeFunction?: EvalCodeFunction;
}

export interface ICodeRuntime<T extends StringDictionary = StringDictionary> extends IDisposable {
  getScope(): ICodeScope<T>;

  run<R = unknown>(code: string, scope?: ICodeScope): R | undefined;

  resolve(value: StringDictionary): any;

  onResolve(handler: NodeResolverHandler): IDisposable;

  createChild<V extends StringDictionary = StringDictionary>(
    options: Omit<CodeRuntimeOptions<V>, 'parentScope'>,
  ): ICodeRuntime<V>;
}

export type NodeResolverHandler = (node: JSNode) => JSNode | false | undefined;

export type EvalCodeFunction = (code: string, scope: any) => any;

export class CodeRuntime<T extends StringDictionary = StringDictionary>
  extends Disposable
  implements ICodeRuntime<T>
{
  private _codeScope: ICodeScope<T>;

  private _evalCodeFunction: EvalCodeFunction = evaluate;

  private _resolveHandlers: NodeResolverHandler[] = [];

  constructor(options: CodeRuntimeOptions<T> = {}) {
    super();

    if (options.evalCodeFunction) this._evalCodeFunction = options.evalCodeFunction;
    this._codeScope = this.addDispose(
      options.parentScope
        ? options.parentScope.createChild<T>(options.initScopeValue ?? {})
        : new CodeScope(options.initScopeValue ?? {}),
    );
  }

  getScope() {
    return this._codeScope;
  }

  run<R = unknown>(code: string): R | undefined {
    this._throwIfDisposed(`this code runtime has been disposed`);

    if (!code) return undefined;

    try {
      const result = this._evalCodeFunction(code, this._codeScope.value);

      return result as R;
    } catch (err) {
      // todo replace logger
      console.error('eval error', code, this._codeScope.value, err);
      return undefined;
    }
  }

  resolve(data: StringDictionary): any {
    if (this._resolveHandlers.length > 0) {
      data = mapValue(data, isNode, (node: JSNode) => {
        let newNode: JSNode | false | undefined = node;

        for (const handler of this._resolveHandlers) {
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
  onResolve(handler: NodeResolverHandler): IDisposable {
    this._resolveHandlers.push(handler);

    return this.addDispose(
      toDisposable(() => {
        this._resolveHandlers = this._resolveHandlers.filter((h) => h !== handler);
      }),
    );
  }

  createChild<V extends StringDictionary = StringDictionary>(
    options?: Omit<CodeRuntimeOptions<V>, 'parentScope'>,
  ): ICodeRuntime<V> {
    return this.addDispose(
      new CodeRuntime({
        initScopeValue: options?.initScopeValue,
        parentScope: this._codeScope,
        evalCodeFunction: options?.evalCodeFunction ?? this._evalCodeFunction,
      }),
    );
  }
}
