import { CompositeValue } from '../../value-type';
import { IPublicModelNode } from './node';
import { IPublicModelProp } from './prop';

export interface IPublicModelProps {
  /**
   * id
   */
  get id(): string;

  /**
   * 返回当前 props 的路径
   */
  get path(): any[];

  /**
   * 返回所属的 node 实例
   */
  get node(): IPublicModelNode | null;

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getProp(path: string): IPublicModelProp | null;

  /**
   * 获取指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getPropValue(path: string): any;

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraProp(path: string): IPublicModelProp | null;

  /**
   * 获取指定 path 的属性模型实例值
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string): any;

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setPropValue(path: string, value: CompositeValue): void;

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setExtraPropValue(path: string, value: CompositeValue): void;

  /**
   * test if the specified key is existing or not.
   * @param key
   * @returns
   */
  has(key: string): boolean;

  /**
   * add a key with given value
   * @param value
   * @param key
   * @returns
   */
  add(value: CompositeValue, key?: string | number | undefined): any;

}
