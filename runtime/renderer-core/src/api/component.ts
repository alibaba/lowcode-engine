import { CreateContainerOptions, createContainer } from '../container';
import { createCodeRuntime, createScope } from '../code-runtime';
import { throwRuntimeError } from '../utils/error';
import { validateContainerSchema } from '../validator/schema';

export interface ComponentOptionsBase<C> {
  componentsTree: RootSchema;
  componentsRecord: Record<string, C | Package>;
  dataSourceCreator: DataSourceCreator;
}

export function createComponentFunction<C, O extends ComponentOptionsBase<C>>(options: {
  stateCreator: (initState: AnyObject) => StateContext;
  componentCreator: (container: Container, componentOptions: O) => C;
  defaultOptions?: Partial<O>;
}): (componentOptions: O) => C {
  const { stateCreator, componentCreator, defaultOptions = {} } = options;

  return (componentOptions) => {
    const finalOptions = Object.assign({}, defaultOptions, componentOptions);
    const { supCodeScope, initScopeValue = {}, dataSourceCreator } = finalOptions;

    const codeRuntimeScope =
      supCodeScope?.createSubScope(initScopeValue) ?? createScope(initScopeValue);
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

        const initialState = codeRuntime.parseExprOrFn(componentsTree.state ?? {});
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
              ? dataSourceCreator(componentsTree.dataSource ?? ({ list: [] } as any), stateContext)
              : {},
          ) as ContainerInstanceScope<C>,
          true,
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

        function triggerLifeCycle(lifeCycleName: LifeCycleNameT, ...args: any[]) {
          // keys 用来判断 lifeCycleName 存在于 schema 对象上，不获取原型链上的对象
          if (
            !componentsTree.lifeCycles ||
            !Object.keys(componentsTree.lifeCycles).includes(lifeCycleName)
          ) {
            return;
          }

          const lifeCycleSchema = componentsTree.lifeCycles[lifeCycleName];
          if (isJsFunction(lifeCycleSchema)) {
            const lifeCycleFn = codeRuntime.createFnBoundScope(lifeCycleSchema.value);
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
            const treeNodes = childNodes.map((item) => {
              return createComponentTreeNode(item, undefined);
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
