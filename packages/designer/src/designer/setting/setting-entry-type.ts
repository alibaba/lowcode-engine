import type { IPublicApiSetters, IPublicModelEditor } from '@alilc/lowcode-types';
import type { IDesigner } from '../designer';
import type { INode } from '../../document';
import type { ISettingField } from './setting-field';

export interface ISettingEntry {
  readonly designer: IDesigner | undefined;

  readonly id: string;

  /**
   * 同样类型的节点
   */
  readonly isSameComponent: boolean;

  /**
   * 一个
   */
  readonly isSingle: boolean;

  /**
   * 多个
   */
  readonly isMultiple: boolean;

  /**
   * 编辑器引用
   */
  readonly editor: IPublicModelEditor;

  readonly setters: IPublicApiSetters;

  /**
   * 取得子项
   */
  get: (propName: string | number) => ISettingField | null;

  readonly nodes: INode[];

  // @todo 补充 node 定义
  /**
   * 获取 node 中的第一项
   */
  getNode: () => any;
}
