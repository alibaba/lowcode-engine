import { IPublicTypeNodeSchema, IPublicTypeNodeData, IPublicTypeIconType, IPublicTypeTransformedComponentMetadata, IPublicTypeI18nData, IPublicTypeNpmInfo } from '../type';
import { ReactElement } from 'react';
import { IPublicModelNode } from './node';

export interface IPublicModelComponentMeta {
  /**
   * 组件名
   */
  get componentName(): string;

  /**
   * 是否是「容器型」组件
   */
  get isContainer(): boolean;

  /**
   * 是否是最小渲染单元。
   * 当组件需要重新渲染时：
   *  若为最小渲染单元，则只渲染当前组件，
   *  若不为最小渲染单元，则寻找到上层最近的最小渲染单元进行重新渲染，直至根节点。
   */
  get isMinimalRenderUnit(): boolean;

  /**
   * 是否为「模态框」组件
   */
  get isModal(): boolean;

  /**
   * 元数据配置
   */
  get configure(): any;

  /**
   * 标题
   */
  get title(): string | IPublicTypeI18nData | ReactElement;

  /**
   * 图标
   */
  get icon(): IPublicTypeIconType;

  /**
   * 组件 npm 信息
   */
  get npm(): IPublicTypeNpmInfo;

  get availableActions(): any;

  /**
   * 设置 npm 信息
   * @param npm
   */
  setNpm(npm: IPublicTypeNpmInfo): void;

  /**
   * 获取元数据
   * @returns
   */
  getMetadata(): IPublicTypeTransformedComponentMetadata;

  /**
   * check if the current node could be placed in parent node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingUp(my: IPublicModelNode | IPublicTypeNodeData, parent: any): boolean;

  /**
   * check if the target node(s) could be placed in current node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingDown(
      my: IPublicModelNode | IPublicTypeNodeData,
      target: IPublicTypeNodeSchema | IPublicModelNode | IPublicTypeNodeSchema[],
    ): boolean;


  refreshMetadata(): void;
}
