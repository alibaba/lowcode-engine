import { isJsFunction } from '@alilc/runtime-shared';
import {
  type CodeRuntime,
  createCodeRuntime,
  type CodeScope,
  createScope,
} from '../core/codeRuntime';
import { throwRuntimeError } from '../core/error';
import { type ComponentTreeNode, createNode } from '../helper/treeNode';
import { validateContainerSchema } from '../helper/validator';

import type {
  RootSchema,
  DataSourceEngine,
  DataSourceCreator,
  AnyObject,
  Package,
} from '@alilc/runtime-shared';

export interface StateContext {
  /** 组件状态 */
  readonly state: AnyObject;
  /** 状态设置方法 */
  setState: (newState: AnyObject) => void;
}

interface ContainerInstanceScope<C = any>
  extends StateContext,
    DataSourceEngine {
  readonly props: AnyObject | undefined;

  $(ref: string): C | undefined;

  [key: string]: any;
}

type LifeCycleName =
  | 'constructor'
  | 'render'
  | 'componentDidMount'
  | 'componentDidUpdate'
  | 'componentWillUnmount'
  | 'componentDidCatch';

export interface ContainerInstance<C = any> {
  readonly id?: string;
  readonly cssText: string | undefined;
  readonly codeScope: CodeScope;

  /** 调用生命周期方法 */
  triggerLifeCycle(lifeCycleName: LifeCycleName, ...args: any[]): void;
  /**
   * 设置 ref 对应的组件实例, 提供给 scope.$() 方式使用
   */
  setRefInstance(ref: string, instance: C): void;
  removeRefInstance(ref: string, instance?: C): void;
  /** 获取子节点内容 渲染使用 */
  getComponentTreeNodes(): ComponentTreeNode[];

  destory(): void;
}

export interface Container {
  readonly codeScope: CodeScope;
  readonly codeRuntime: CodeRuntime;

  createInstance(
    componentsTree: RootSchema,
    extraProps?: AnyObject
  ): ContainerInstance;
}

export interface ComponentOptionsBase<C> {
  componentsTree: RootSchema;
  componentsRecord: Record<string, C | Package>;
  supCodeScope?: CodeScope;
  initScopeValue?: AnyObject;
  dataSourceCreator: DataSourceCreator;
}

export function createComponentFunction<
  C,
  O extends ComponentOptionsBase<C>
>(options: {
  stateCreator: (initState: AnyObject) => StateContext;
  componentCreator: (container: Container, componentOptions: O) => C;
  defaultOptions?: Partial<O>;
}): (componentOptions: O) => C {
  const { stateCreator, componentCreator, defaultOptions = {} } = options;

  return componentOptions => {
    const finalOptions = Object.assign({}, defaultOptions, componentOptions);
    const {
      supCodeScope,
      initScopeValue = {},
      dataSourceCreator,
    } = finalOptions;

    const codeRuntimeScope =
      supCodeScope?.createSubScope(initScopeValue) ??
      createScope(initScopeValue);
    const codeRuntime = createCodeRuntime(codeRuntimeScope);

    const container: Container = {
      get codeScope() {
        return codeRuntimeScope;
      },
      get codeRuntime() {
        return codeRuntime;
      },

      createInstance(componentsTree, extraProps = {}) {
        if (!validateContainerSchema(componentsTree)) {
          throwRuntimeError('createComponent', 'componentsTree is not valid!');
        }

        const mapRefToComponentInstance: Map<string, C> = new Map();

        const initialState = codeRuntime.parseExprOrFn(
          componentsTree.state ?? {}
        );
        const stateContext = stateCreator(initialState);

        codeRuntimeScope.setValue(
          Object.assign(
            {
              props: codeRuntime.parseExprOrFn({
                ...componentsTree.defaultProps,
                ...componentsTree.props,
                ...extraProps,
              }),
              $(ref: string) {
                return mapRefToComponentInstance.get(ref);
              },
            },
            stateContext,
            dataSourceCreator
              ? dataSourceCreator(
                  componentsTree.dataSource ?? ({ list: [] } as any),
                  stateContext
                )
              : {}
          ) as ContainerInstanceScope<C>,
          true
        );

        if (componentsTree.methods) {
          for (const [key, fn] of Object.entries(componentsTree.methods)) {
            const customMethod = codeRuntime.createFnBoundScope(fn.value);
            if (customMethod) {
              codeRuntimeScope.inject(key, customMethod);
            }
          }
        }

        triggerLifeCycle('constructor');

        function triggerLifeCycle(
          lifeCycleName: LifeCycleName,
          ...args: any[]
        ) {
          // keys 用来判断 lifeCycleName 存在于 schema 对象上，不获取原型链上的对象
          if (
            !componentsTree.lifeCycles ||
            !Object.keys(componentsTree.lifeCycles).includes(lifeCycleName)
          ) {
            return;
          }

          const lifeCycleSchema = componentsTree.lifeCycles[lifeCycleName];
          if (isJsFunction(lifeCycleSchema)) {
            const lifeCycleFn = codeRuntime.createFnBoundScope(
              lifeCycleSchema.value
            );
            if (lifeCycleFn) {
              lifeCycleFn.apply(codeRuntime.getScope().value, args);
            }
          }
        }

        const instance: ContainerInstance<C> = {
          get id() {
            return componentsTree.id;
          },
          get cssText() {
            return componentsTree.css;
          },
          get codeScope() {
            return codeRuntimeScope;
          },

          triggerLifeCycle,
          setRefInstance(ref, instance) {
            mapRefToComponentInstance.set(ref, instance);
          },
          removeRefInstance(ref) {
            mapRefToComponentInstance.delete(ref);
          },
          getComponentTreeNodes() {
            const childNodes = componentsTree.children
              ? Array.isArray(componentsTree.children)
                ? componentsTree.children
                : [componentsTree.children]
              : [];
            const treeNodes = childNodes.map(item => {
              return createNode(item, undefined);
            });

            return treeNodes;
          },

          destory() {
            mapRefToComponentInstance.clear();
            codeRuntimeScope.setValue({});
          },
        };

        return instance;
      },
    };

    return componentCreator(container, componentOptions);
  };
}
