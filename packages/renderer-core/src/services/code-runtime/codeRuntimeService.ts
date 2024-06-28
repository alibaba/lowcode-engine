import {
  type PlainObject,
  type Spec,
  type EventDisposable,
  createDecorator,
  Provide,
  isJSExpression,
  isJSFunction,
} from '@alilc/lowcode-shared';
import { type ICodeScope, CodeScope } from './codeScope';
import { evaluate } from '../../utils/evaluate';
import { isNode } from '../../utils/node';
import { mapValue } from '../../utils/value';

export interface ResolveOptions {
  scope?: ICodeScope;
}

export type NodeResolverHandler = (node: Spec.JSNode) => Spec.JSNode | false | undefined;

export interface ICodeRuntimeService {
  initialize(options: CodeRuntimeInitializeOptions): void;

  getScope(): ICodeScope;

  run<R = unknown>(code: string, scope?: ICodeScope): R | undefined;

  resolve(value: PlainObject, options?: ResolveOptions): any;

  onResolve(handler: NodeResolverHandler): EventDisposable;

  createChildScope(value: PlainObject): ICodeScope;
}

export const ICodeRuntimeService = createDecorator<ICodeRuntimeService>('codeRuntimeService');

export interface CodeRuntimeInitializeOptions {
  evalCodeFunction?: (code: string, scope: any) => any;
}

@Provide(ICodeRuntimeService)
export class CodeRuntimeService implements ICodeRuntimeService {
  private codeScope: ICodeScope = new CodeScope({});

  private evalCodeFunction = evaluate;

  private onResolveHandlers: NodeResolverHandler[] = [];

  initialize(options: CodeRuntimeInitializeOptions) {
    if (options.evalCodeFunction) this.evalCodeFunction = options.evalCodeFunction;
  }

  getScope() {
    return this.codeScope;
  }

  run<R = unknown>(code: string, scope: ICodeScope = this.codeScope): R | undefined {
    if (!code) return undefined;

    try {
      const result = this.evalCodeFunction(code, scope.value);

      return result as R;
    } catch (err) {
      // todo replace logger
      console.error('eval error', code, scope.value, err);
      return undefined;
    }
  }

  resolve(data: PlainObject, options: ResolveOptions = {}): any {
    const handlers = this.onResolveHandlers;

    if (handlers.length > 0) {
      data = mapValue(data, isNode, (node: Spec.JSNode) => {
        let newNode: Spec.JSNode | false | undefined = node;

        for (const handler of handlers) {
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
        return this.resolveExprOrFunction(node, options);
      },
    );
  }

  private resolveExprOrFunction(
    node: Spec.JSExpression | Spec.JSFunction,
    options: ResolveOptions,
  ) {
    const scope = options.scope || this.codeScope;
    const v = this.run(node.value, scope) as any;

    if (typeof v === 'undefined' && node.mock) {
      return this.resolve(node.mock, options);
    }
    return v;
  }

  /**
   * 顺序执行 handler
   */
  onResolve(handler: NodeResolverHandler): EventDisposable {
    this.onResolveHandlers.push(handler);
    return () => {
      this.onResolveHandlers = this.onResolveHandlers.filter((h) => h !== handler);
    };
  }

  createChildScope(value: PlainObject): ICodeScope {
    return this.codeScope.createChild(value);
  }
}
