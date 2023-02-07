import { IPublicModelNode, IPublicModelSettingPropEntry } from './';

export interface IPublicModelSettingTopEntry {

  /**
   * 返回所属的节点实例
   */
  get node(): IPublicModelNode | null;

  /**
   * 获取子级属性对象
   * @param propName
   * @returns
   */
  get(propName: string | number): IPublicModelSettingPropEntry;

  /**
   * 获取指定 propName 的值
   * @param propName
   * @returns
   */
  getPropValue(propName: string | number): any;

  /**
   * 设置指定 propName 的值
   * @param propName
   * @param value
   */
  setPropValue(propName: string | number, value: any): void;
}
