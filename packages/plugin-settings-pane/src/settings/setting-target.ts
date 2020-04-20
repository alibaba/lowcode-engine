import { ComponentMeta, Designer, Node } from '@ali/lowcode-designer';
import Editor from '@ali/lowcode-editor-core';

export interface SettingTarget {

  readonly nodes: Node[];

  readonly componentMeta: ComponentMeta | null;

  /**
   * 同样类型的节点
   */
  readonly isSameComponent: boolean;

  /**
   * 一个
   */
  readonly isOneNode: boolean;

  /**
   * 多个
   */
  readonly isMultiNodes: boolean;

  /**
   * 编辑器引用
   */
  readonly editor: Editor;

  readonly designer: Designer;

  readonly path: Array<string| number>;

  // 顶端对应 Props
  readonly top: SettingTarget;

  // 父级
  readonly parent: SettingTarget;


  // 获取当前值
  getValue(): any;

  // 设置当前值
  setValue(value: any): void;

  // 取得子项
  get(propName: string | number): SettingTarget;

  // 获取子项属性值
  getPropValue(propName: string | number): any;

  // 设置子项属性值
  setPropValue(propName: string | number, value: any): void;

  // 取得兄弟项
  getSibling(propName: string | number): SettingTarget | null;

  // 取得兄弟属性值
  getSiblingValue(propName: string | number): any;

  // 设置兄弟属性值
  setSiblingValue(propName: string | number, value: any): void;

  // 获取顶层附属属性值
  getExtraPropValue(propName: string): any;

  // 设置顶层附属属性值
  setExtraPropValue(propName: string, value: any): void;
}
