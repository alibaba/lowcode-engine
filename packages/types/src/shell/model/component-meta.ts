import { NodeSchema, NodeData } from '../../schema';
import { IconType } from '../../icon';
import { TransformedComponentMetadata } from '../../metadata';
import { ReactElement } from 'react';
import { I18nData } from '../../i18n';
import { NpmInfo } from '../../npm';
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
  get title(): string | I18nData | ReactElement;

  /**
   * 图标
   */
  get icon(): IconType;

  /**
   * 组件 npm 信息
   */
  get npm(): NpmInfo;

  get availableActions(): any;

  /**
   * 设置 npm 信息
   * @param npm
   */
  setNpm(npm: NpmInfo): void;

  /**
   * 获取元数据
   * @returns
   */
  getMetadata(): TransformedComponentMetadata;

  /**
   * check if the current node could be placed in parent node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingUp(my: IPublicModelNode | NodeData, parent: any): boolean;

  /**
   * check if the target node(s) could be placed in current node
   * @param my
   * @param parent
   * @returns
   */
  checkNestingDown(my: IPublicModelNode | NodeData, target: NodeSchema | IPublicModelNode | NodeSchema[]): boolean;


  refreshMetadata(): void;
}
