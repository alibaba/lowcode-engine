import { IEditor } from './editor';

export interface SettingTarget {
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
  readonly editor: IEditor;

  /**
   * 访问路径
   */
  readonly path: Array<string| number>;

  /**
   * 顶端
   */
  readonly top: SettingTarget;

  /**
   * 父级
   */
  readonly parent: SettingTarget;


  /**
   * 获取当前值
   */
  getValue: () => any;

  /**
   * 设置当前值
   */
  setValue: (value: any) => void;

  /**
   * 取得子项
   */
  get: (propName: string | number) => SettingTarget | null;

  /**
   * 取得子项
   */
  getProps?: () => SettingTarget;

  /**
   * 获取子项属性值
   */
  getPropValue: (propName: string | number) => any;

  /**
   * 设置子项属性值
   */
  setPropValue: (propName: string | number, value: any) => void;

  /**
   * 清除已设置值
   */
  clearPropValue: (propName: string | number) => void;

  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue: (propName: string) => any;

  /**
   * 设置顶层附属属性值
   */
  setExtraPropValue: (propName: string, value: any) => void;

  // @todo 补充 node 定义
  /**
   * 获取 node 中的第一项
   */
  getNode: () => any;
}
