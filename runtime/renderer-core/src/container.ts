import type {
  InstanceApi,
  PlainObject,
  ComponentTree,
  InstanceDataSourceApi,
  InstanceStateApi,
} from './types';
import { type CodeScope, type CodeRuntime, createCodeRuntime, createScope } from './code-runtime';
import { isJSFunction } from './utils/type-guard';
import { type TextWidget, type ComponentWidget, createWidget } from './widget';

/**
 * 根据低代码搭建协议的容器组件描述生成的容器实例
 */
export interface Container<InstanceT = unknown, LifeCycleNameT extends string = string> {
  readonly codeRuntime: CodeRuntime;
  readonly instanceApiObject: InstanceApi<InstanceT>;

  /**
   * 获取协议中的 css 内容
   */
  getCssText(): string | undefined;
  /**
   * 调用生命周期方法
   */
  triggerLifeCycle(lifeCycleName: LifeCycleNameT, ...args: any[]): void;
  /**
   * 设置 ref 对应的组件实例, 提供给 scope.$() 方式使用
   */
  setInstance(ref: string, instance: InstanceT): void;
  /**
   * 移除 ref 对应的组件实例
   */
  removeInstance(ref: string, instance?: InstanceT): void;

  createWidgets<Element>(): (TextWidget<Element> | ComponentWidget<Element>)[];
}

export interface CreateContainerOptions<LifeCycleNameT extends string> {
  supCodeScope?: CodeScope;
  initScopeValue?: PlainObject;
  componentsTree: ComponentTree<LifeCycleNameT>;
  stateCreator: (initalState: PlainObject) => InstanceStateApi;
  // type todo
  dataSourceCreator: (...args: any[]) => InstanceDataSourceApi;
}

export function createContainer<InstanceT, LifeCycleNameT extends string>(
  options: CreateContainerOptions<LifeCycleNameT>,
): Container<InstanceT, LifeCycleNameT> {
  const {
    componentsTree,
    supCodeScope,
    initScopeValue = {},
    stateCreator,
    dataSourceCreator,
  } = options;

  validContainerSchema(componentsTree);

  const instancesMap = new Map<string, InstanceT[]>();
  const subScope = supCodeScope
    ? supCodeScope.createSubScope(initScopeValue)
    : createScope(initScopeValue);
  const codeRuntime = createCodeRuntime(subScope);

  const initalState = codeRuntime.parseExprOrFn(componentsTree.state ?? {});
  const initalProps = codeRuntime.parseExprOrFn(componentsTree.props ?? {});

  const stateApi = stateCreator(initalState);
  const dataSourceApi = dataSourceCreator(componentsTree.dataSource, stateApi);

  const instanceApiObject: InstanceApi<InstanceT> = Object.assign(
    {
      props: initalProps,
      $(ref: string) {
        const insArr = instancesMap.get(ref);
        if (!insArr) return undefined;

        return insArr[0];
      },
      $$(ref: string) {
        return instancesMap.get(ref) ?? [];
      },
    },
    stateApi,
    dataSourceApi,
  );

  if (componentsTree.methods) {
    for (const [key, fn] of Object.entries(componentsTree.methods)) {
      const customMethod = codeRuntime.createFnBoundScope(fn.value);
      if (customMethod) {
        instanceApiObject[key] = customMethod;
      }
    }
  }

  const containerCodeScope = subScope.createSubScope(instanceApiObject);

  codeRuntime.bindingScope(containerCodeScope);

  function setInstanceByRef(ref: string, ins: InstanceT) {
    let insArr = instancesMap.get(ref);
    if (!insArr) {
      insArr = [];
      instancesMap.set(ref, insArr);
    }
    insArr!.push(ins);
  }

  function removeInstanceByRef(ref: string, ins?: InstanceT) {
    const insArr = instancesMap.get(ref);
    if (insArr) {
      if (ins) {
        const idx = insArr.indexOf(ins);
        if (idx > 0) insArr.splice(idx, 1);
      } else {
        instancesMap.delete(ref);
      }
    }
  }

  function triggerLifeCycle(lifeCycleName: LifeCycleNameT, ...args: any[]) {
    // keys 用来判断 lifeCycleName 存在于 schema 对象上，不获取原型链上的对象
    if (
      !componentsTree.lifeCycles ||
      !Object.keys(componentsTree.lifeCycles).includes(lifeCycleName)
    ) {
      return;
    }

    const lifeCycleSchema = componentsTree.lifeCycles[lifeCycleName];
    if (isJSFunction(lifeCycleSchema)) {
      const lifeCycleFn = codeRuntime.createFnBoundScope(lifeCycleSchema.value);
      if (lifeCycleFn) {
        lifeCycleFn.apply(containerCodeScope.value, args);
      }
    }
  }

  return {
    get codeRuntime() {
      return codeRuntime;
    },
    get instanceApiObject() {
      return containerCodeScope.value as InstanceApi<InstanceT>;
    },

    getCssText() {
      return componentsTree.css;
    },
    triggerLifeCycle,

    setInstance: setInstanceByRef,
    removeInstance: removeInstanceByRef,

    createWidgets<Element>() {
      if (!componentsTree.children) return [];
      return componentsTree.children.map((item) => createWidget<Element>(item));
    },
  };
}

const CONTAINTER_NAME = ['Page', 'Block', 'Component'];

function validContainerSchema(schema: ComponentTree) {
  if (!CONTAINTER_NAME.includes(schema.componentName)) {
    throw Error('container schema not valid');
  }
}
