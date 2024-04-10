import { IPublicTypeCompositeValue } from '../type';
import { IPublicModelNode, IPublicModelProp } from './';

export interface IBaseModelProps<
  Prop
> {

  /**
   * id
   */
  get id(): string;

  /**
   * 返回当前 props 的路径
   * return path of current props
   */
  get path(): string[];

  /**
   * 返回所属的 node 实例
   */
  get node(): IPublicModelNode | null;

  /**
   * 获取指定 path 的属性模型实例
   * get prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getProp(path: string): Prop | null;

  /**
   * 获取指定 path 的属性模型实例值
   * get value of prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getPropValue(path: string): any;

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * get extra prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getExtraProp(path: string): Prop | null;

  /**
   * 获取指定 path 的属性模型实例值
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * get value of extra prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getExtraPropValue(path: string): any;

  /**
   * 设置指定 path 的属性模型实例值
   * set value of prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   */
  setPropValue(path: string, value: IPublicTypeCompositeValue): void;

  /**
   * 设置指定 path 的属性模型实例值
   * set value of extra prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   */
  setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void;

  /**
   * 当前 props 是否包含某 prop
   * check if the specified key is existing or not.
   * @param key
   * @since v1.1.0
   */
  has(key: string): boolean;

  /**
   * 添加一个 prop
   * add a key with given value
   * @param value
   * @param key
   * @since v1.1.0
   */
  add(value: IPublicTypeCompositeValue, key?: string | number | undefined): any;

}

export interface IPublicModelProps extends IBaseModelProps<IPublicModelProp> {}
