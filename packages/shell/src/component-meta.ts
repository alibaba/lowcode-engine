import {
  ComponentMeta as InnerComponentMeta,
  ParentalNode,
} from '@alilc/lowcode-designer';
import Node from './node';
import { NodeData, NodeSchema } from '@alilc/lowcode-types';
import { componentMetaSymbol, nodeSymbol } from './symbols';

export default class ComponentMeta {
  private readonly [componentMetaSymbol]: InnerComponentMeta;

  constructor(componentMeta: InnerComponentMeta) {
    this[componentMetaSymbol] = componentMeta;
  }

  static create(componentMeta: InnerComponentMeta | null) {
    if (!componentMeta) return null;
    return new ComponentMeta(componentMeta);
  }

  /**
   * 组件名
   */
  get componentName(): string {
    return this[componentMetaSymbol].componentName;
  }

  /**
   * 是否是「容器型」组件
   */
  get isContainer(): boolean {
    return this[componentMetaSymbol].isContainer;
  }

  /**
   * 是否是最小渲染单元。
   * 当组件需要重新渲染时：
   *  若为最小渲染单元，则只渲染当前组件，
   *  若不为最小渲染单元，则寻找到上层最近的最小渲染单元进行重新渲染，直至根节点。
   */
  get isMinimalRenderUnit(): boolean {
    return this[componentMetaSymbol].isMinimalRenderUnit;
  }

  /**
   * 是否为「模态框」组件
   */
  get isModal(): boolean {
    return this[componentMetaSymbol].isModal;
  }

  /**
   * 元数据配置
   */
  get configure() {
    return this[componentMetaSymbol].configure;
  }

  /**
   * 标题
   */
  get title() {
    return this[componentMetaSymbol].title;
  }

  /**
   * 图标
   */
  get icon() {
    return this[componentMetaSymbol].icon;
  }

  /**
   * 组件 npm 信息
   */
  get npm() {
    return this[componentMetaSymbol].npm;
  }

  /**
   * @deprecated
   */
  get prototype() {
    return this[componentMetaSymbol].prototype;
  }

  get availableActions() {
    return this[componentMetaSymbol].availableActions;
  }

  /**
   * 设置 npm 信息
   * @param npm
   */
  setNpm(npm: any) {
    this[componentMetaSymbol].setNpm(npm);
  }

  /**
   * 获取元数据
   * @returns
   */
  getMetadata() {
    return this[componentMetaSymbol].getMetadata();
  }

  /**
   * check if the current node could be placed in parent node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingUp(my: Node | NodeData, parent: ParentalNode<NodeSchema>) {
    const curNode = my.isNode ? my[nodeSymbol] : my;
    return this[componentMetaSymbol].checkNestingUp(curNode as any, parent);
  }

  /**
   * check if the target node(s) could be placed in current node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingDown(my: Node | NodeData, target: NodeSchema | Node | NodeSchema[]) {
    const curNode = my.isNode ? my[nodeSymbol] : my;
    return this[componentMetaSymbol].checkNestingDown(curNode as any, target[nodeSymbol] || target);
  }

  refreshMetadata() {
    this[componentMetaSymbol].refreshMetadata();
  }
}
