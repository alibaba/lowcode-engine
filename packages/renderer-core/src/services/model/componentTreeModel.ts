import {
  type Spec,
  type PlainObject,
  isComponentNode,
  invariant,
  uniqueId,
} from '@alilc/lowcode-shared';
import { type ICodeScope, type ICodeRuntimeService } from '../code-runtime';
import { IWidget, Widget } from '../widget';

export interface NormalizedComponentNode extends Spec.ComponentNode {
  loopArgs: [string, string];
  props: Spec.ComponentNodeProps;
}

export interface InitializeModelOptions {
  defaultProps?: PlainObject | undefined;
  stateCreator: ModelScopeStateCreator;
  dataSourceCreator?: ModelScopeDataSourceCreator;
}

/**
 * 根据低代码搭建协议的容器组件描述生成的容器模型
 */
export interface IComponentTreeModel<Component, ComponentInstance = unknown> {
  readonly id: string;

  readonly codeScope: ICodeScope;

  readonly codeRuntime: ICodeRuntimeService;

  readonly widgets: IWidget<Component, ComponentInstance>[];

  initialize(options: InitializeModelOptions): void;

  /**
   * 获取协议中的 css 内容
   */
  getCssText(): string | undefined;
  /**
   * 调用生命周期方法
   */
  triggerLifeCycle(lifeCycleName: Spec.ComponentLifeCycle, ...args: any[]): void;
  /**
   * 设置 ref 对应的组件实例, 提供给 scope.$() 方式使用
   */
  setComponentRef(ref: string, component: ComponentInstance): void;
  /**
   * 移除 ref 对应的组件实例
   */
  removeComponentRef(ref: string, component?: ComponentInstance): void;

  /**
   * 根据 compoonentsTree.children 构建 widget 渲染对象
   */
  buildWidgets(nodes: Spec.NodeType[]): IWidget<Component, ComponentInstance>[];
}

export type ModelScopeStateCreator = (initalState: PlainObject) => Spec.InstanceStateApi;
export type ModelScopeDataSourceCreator = (...args: any[]) => Spec.InstanceDataSourceApi;

export interface ComponentTreeModelOptions {
  id?: string;
  metadata?: PlainObject;
}

export class ComponentTreeModel<Component, ComponentInstance = unknown>
  implements IComponentTreeModel<Component, ComponentInstance>
{
  private instanceMap = new Map<string, ComponentInstance[]>();

  public id: string;

  public codeScope: ICodeScope;

  public widgets: IWidget<Component>[] = [];

  public metadata: PlainObject = {};

  constructor(
    public componentsTree: Spec.ComponentTree,
    public codeRuntime: ICodeRuntimeService,
    options?: ComponentTreeModelOptions,
  ) {
    invariant(componentsTree, 'componentsTree must to provide', 'ComponentTreeModel');

    this.id = options?.id ?? `model_${uniqueId()}`;
    if (options?.metadata) {
      this.metadata = options.metadata;
    }

    if (componentsTree.children) {
      this.widgets = this.buildWidgets(componentsTree.children);
    }
  }

  initialize({ defaultProps, stateCreator, dataSourceCreator }: InitializeModelOptions) {
    const {
      state = {},
      defaultProps: defaultSchemaProps,
      props = {},
      dataSource,
      methods = {},
    } = this.componentsTree;

    this.codeScope = this.codeRuntime.createChildScope({
      props: {
        ...props,
        ...defaultSchemaProps,
        ...defaultProps,
      },
    });

    const initalProps = this.codeRuntime.resolve(props, { scope: this.codeScope });
    this.codeScope.setValue({ props: { ...defaultProps, ...initalProps } });

    const initalState = this.codeRuntime.resolve(state, { scope: this.codeScope });
    const stateApi = stateCreator(initalState);
    this.codeScope.setValue(stateApi);

    let dataSourceApi: Spec.InstanceDataSourceApi | undefined;
    if (dataSource && dataSourceCreator) {
      const dataSourceProps = this.codeRuntime.resolve(dataSource, { scope: this.codeScope });
      dataSourceApi = dataSourceCreator(dataSourceProps, stateApi);
    }

    this.codeScope.setValue(
      Object.assign(
        {
          $: (ref: string) => {
            const insArr = this.instanceMap.get(ref);
            if (!insArr) return undefined;
            return insArr[0];
          },
          $$: (ref: string) => {
            return this.instanceMap.get(ref) ?? [];
          },
        },
        dataSourceApi,
      ),
    );

    for (const [key, fn] of Object.entries(methods)) {
      const customMethod = this.codeRuntime.resolve(fn, { scope: this.codeScope });
      if (typeof customMethod === 'function') {
        this.codeScope.set(key, customMethod);
      }
    }
  }

  getCssText(): string | undefined {
    return this.componentsTree.css;
  }

  triggerLifeCycle(lifeCycleName: Spec.ComponentLifeCycle, ...args: any[]) {
    // keys 用来判断 lifeCycleName 存在于 schema 对象上，不获取原型链上的对象
    if (
      !this.componentsTree.lifeCycles ||
      !Object.keys(this.componentsTree.lifeCycles).includes(lifeCycleName)
    ) {
      return;
    }

    const lifeCycleSchema = this.componentsTree.lifeCycles[lifeCycleName];

    const lifeCycleFn = this.codeRuntime.resolve(lifeCycleSchema, { scope: this.codeScope });
    if (typeof lifeCycleFn === 'function') {
      lifeCycleFn.apply(this.codeScope.value, args);
    }
  }

  setComponentRef(ref: string, ins: ComponentInstance) {
    let insArr = this.instanceMap.get(ref);
    if (!insArr) {
      insArr = [];
      this.instanceMap.set(ref, insArr);
    }
    insArr!.push(ins);
  }

  removeComponentRef(ref: string, ins?: ComponentInstance) {
    const insArr = this.instanceMap.get(ref);
    if (insArr) {
      if (ins) {
        const idx = insArr.indexOf(ins);
        if (idx > 0) insArr.splice(idx, 1);
      } else {
        this.instanceMap.delete(ref);
      }
    }
  }

  buildWidgets(nodes: Spec.NodeType[]): IWidget<Component>[] {
    return nodes.map((node) => {
      if (isComponentNode(node)) {
        const normalized = normalizeComponentNode(node);
        const widget = new Widget<Component, ComponentInstance>(normalized, this);

        if (normalized.children?.length) {
          widget.children = this.buildWidgets(normalized.children);
        }

        return widget;
      } else {
        return new Widget<Component, ComponentInstance>(node, this);
      }
    });
  }
}

export function normalizeComponentNode(node: Spec.ComponentNode): NormalizedComponentNode {
  const [loopArgsOne, loopArgsTwo] = node.loopArgs ?? [];
  const { children, ...props } = node.props ?? {};

  return {
    ...node,
    loopArgs: [loopArgsOne || 'item', loopArgsTwo || 'index'],
    props,
    condition: node.condition || node.condition === false ? node.condition : true,
    children: node.children ?? children,
  };
}
