import {
  type ComponentNode,
  type ComponentNodeProps,
  type StringDictionary,
  type ComponentLifeCycle,
  type NodeType,
  type InstanceApi,
  type InstanceStateApi,
  type ComponentDataSource,
  type InstanceDataSourceApi,
  type ComponentTree,
  specTypes,
  uniqueId,
  type IDisposable,
  Disposable,
} from '@alilc/lowcode-shared';
import { type ICodeRuntime } from '../code-runtime';
import { IWidget, Widget } from '../../widget';

export interface NormalizedComponentNode extends ComponentNode {
  loopArgs: [string, string];
  props: ComponentNodeProps;
}

/**
 * 根据低代码搭建协议的容器组件描述生成的容器模型
 */
export interface IComponentTreeModel<Component, ComponentInstance = unknown> {
  readonly id: string;

  readonly codeRuntime: ICodeRuntime;

  readonly widgets: IWidget<Component, ComponentInstance>[];

  /**
   * 获取协议中的 css 内容
   */
  getCssText(): string | undefined;
  /**
   * 调用生命周期方法
   */
  triggerLifeCycle(lifeCycleName: ComponentLifeCycle, ...args: any[]): void;
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
  buildWidgets(nodes: NodeType[]): IWidget<Component, ComponentInstance>[];
}

export type ModelStateCreator = (initalState: StringDictionary) => InstanceStateApi;
export type ModelDataSourceCreator = (
  dataSourceSchema: ComponentDataSource,
  codeRuntime: ICodeRuntime<InstanceApi>,
) => InstanceDataSourceApi;

export interface ComponentTreeModelOptions extends IDisposable {
  id?: string;
  metadata?: StringDictionary;

  stateCreator: ModelStateCreator;
  dataSourceCreator?: ModelDataSourceCreator;
}

export class ComponentTreeModel<Component, ComponentInstance = unknown>
  extends Disposable
  implements IComponentTreeModel<Component, ComponentInstance>
{
  private _instanceMap = new Map<string, ComponentInstance[]>();

  private _id: string;

  private _widgets?: IWidget<Component>[];

  private _metadata: StringDictionary;

  constructor(
    private _componentsTree: ComponentTree,
    private _codeRuntime: ICodeRuntime<InstanceApi>,
    options: ComponentTreeModelOptions,
  ) {
    super();

    this._id = options?.id ?? `model_${uniqueId()}`;
    this._metadata = options?.metadata ?? {};
    this.initialize(options);
    this.addDispose(_codeRuntime);
  }

  get id() {
    return this._id;
  }

  get codeRuntime() {
    return this._codeRuntime;
  }

  get metadata() {
    return this._metadata;
  }

  get widgets() {
    if (!this._componentsTree.children) return [];

    if (!this._widgets) {
      this._widgets = this.buildWidgets(this._componentsTree.children);
    }
    return this._widgets;
  }

  private initialize({ stateCreator, dataSourceCreator }: ComponentTreeModelOptions) {
    const { state = {}, defaultProps, props = {}, dataSource, methods = {} } = this._componentsTree;
    const codeScope = this.codeRuntime.getScope();

    const initalProps = this.codeRuntime.resolve(props);
    codeScope.setValue({ props: { ...defaultProps, ...codeScope.value.props, ...initalProps } });

    const initalState = this.codeRuntime.resolve(state);
    const stateApi = stateCreator(initalState);
    codeScope.setValue(stateApi);

    let dataSourceApi: InstanceDataSourceApi | undefined;
    if (dataSource && dataSourceCreator) {
      const dataSourceProps = this.codeRuntime.resolve(dataSource);
      dataSourceApi = dataSourceCreator(dataSourceProps, this.codeRuntime);
    }

    codeScope.setValue(
      Object.assign(
        {
          $: (ref: string) => {
            const insArr = this._instanceMap.get(ref);
            if (!insArr) return undefined;
            return insArr[0];
          },
          $$: (ref: string) => {
            return this._instanceMap.get(ref) ?? [];
          },
        },
        dataSourceApi,
      ),
    );

    for (const [key, fn] of Object.entries(methods)) {
      const customMethod = this.codeRuntime.resolve(fn);
      if (typeof customMethod === 'function') {
        codeScope.set(key, customMethod);
      }
    }
  }

  getCssText(): string | undefined {
    return this._componentsTree.css;
  }

  triggerLifeCycle(lifeCycleName: ComponentLifeCycle, ...args: any[]) {
    // keys 用来判断 lifeCycleName 存在于 schema 对象上，不获取原型链上的对象
    if (
      !this._componentsTree.lifeCycles ||
      !Object.keys(this._componentsTree.lifeCycles).includes(lifeCycleName)
    ) {
      return;
    }

    const lifeCycleSchema = this._componentsTree.lifeCycles[lifeCycleName];

    const lifeCycleFn = this.codeRuntime.resolve(lifeCycleSchema);
    if (typeof lifeCycleFn === 'function') {
      lifeCycleFn.apply(this.codeRuntime.getScope().value, args);
    }
  }

  setComponentRef(ref: string, ins: ComponentInstance) {
    let insArr = this._instanceMap.get(ref);
    if (!insArr) {
      insArr = [];
      this._instanceMap.set(ref, insArr);
    }
    insArr!.push(ins);
  }

  removeComponentRef(ref: string, ins?: ComponentInstance) {
    const insArr = this._instanceMap.get(ref);
    if (insArr) {
      if (ins) {
        const idx = insArr.indexOf(ins);
        if (idx > 0) insArr.splice(idx, 1);
      } else {
        this._instanceMap.delete(ref);
      }
    }
  }

  buildWidgets(nodes: NodeType[]): IWidget<Component>[] {
    return nodes.map((node) => {
      if (specTypes.isComponentNode(node)) {
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

  dispose(): void {
    super.dispose();
    this._instanceMap.clear();
  }
}

export function normalizeComponentNode(node: ComponentNode): NormalizedComponentNode {
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
