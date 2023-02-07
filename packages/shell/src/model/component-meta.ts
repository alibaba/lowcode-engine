import {
  IComponentMeta as InnerComponentMeta,
  INode,
} from '@alilc/lowcode-designer';
import { IPublicTypeNodeData, IPublicTypeNodeSchema, IPublicModelComponentMeta, IPublicTypeI18nData, IPublicTypeIconType, IPublicTypeNpmInfo, IPublicTypeTransformedComponentMetadata, IPublicModelNode, IPublicTypeAdvanced, IPublicTypeFieldConfig } from '@alilc/lowcode-types';
import { componentMetaSymbol, nodeSymbol } from '../symbols';
import { ReactElement } from 'react';

export class ComponentMeta implements IPublicModelComponentMeta {
  private readonly [componentMetaSymbol]: InnerComponentMeta;

  isComponentMeta = true;

  constructor(componentMeta: InnerComponentMeta) {
    this[componentMetaSymbol] = componentMeta;
  }

  static create(componentMeta: InnerComponentMeta | null): IPublicModelComponentMeta | null {
    if (!componentMeta) {
      return null;
    }
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
  get configure(): IPublicTypeFieldConfig[] {
    return this[componentMetaSymbol].configure;
  }

  /**
   * 标题
   */
  get title(): string | IPublicTypeI18nData | ReactElement {
    return this[componentMetaSymbol].title;
  }

  /**
   * 图标
   */
  get icon(): IPublicTypeIconType {
    return this[componentMetaSymbol].icon;
  }

  /**
   * 组件 npm 信息
   */
  get npm(): IPublicTypeNpmInfo {
    return this[componentMetaSymbol].npm;
  }

  /**
   * @deprecated
   */
  get prototype() {
    return (this[componentMetaSymbol] as any).prototype;
  }

  get availableActions(): any {
    return this[componentMetaSymbol].availableActions;
  }

  get advanced(): IPublicTypeAdvanced {
    return this[componentMetaSymbol].advanced;
  }

  /**
   * 设置 npm 信息
   * @param npm
   */
  setNpm(npm: IPublicTypeNpmInfo): void {
    this[componentMetaSymbol].setNpm(npm);
  }

  /**
   * 获取元数据
   * @returns
   */
  getMetadata(): IPublicTypeTransformedComponentMetadata {
    return this[componentMetaSymbol].getMetadata();
  }

  /**
   * check if the current node could be placed in parent node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingUp(my: IPublicModelNode | IPublicTypeNodeData, parent: INode): boolean {
    const curNode = (my as any).isNode ? (my as any)[nodeSymbol] : my;
    return this[componentMetaSymbol].checkNestingUp(curNode as any, parent);
  }

  /**
   * check if the target node(s) could be placed in current node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingDown(
      my: IPublicModelNode | IPublicTypeNodeData,
      target: IPublicTypeNodeSchema | IPublicModelNode | IPublicTypeNodeSchema[],
    ) {
    const curNode = (my as any)?.isNode ? (my as any)[nodeSymbol] : my;
    return this[componentMetaSymbol].checkNestingDown(
        curNode as any,
        (target as any)[nodeSymbol] || target,
      );
  }

  refreshMetadata(): void {
    this[componentMetaSymbol].refreshMetadata();
  }
}
