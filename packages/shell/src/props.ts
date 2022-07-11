import { Props as InnerProps, getConvertedExtraKey } from '@alilc/lowcode-designer';
import { CompositeValue, TransformStage } from '@alilc/lowcode-types';
import { propsSymbol } from './symbols';
import Node from './node';
import Prop from './prop';

export default class Props {
  private readonly [propsSymbol]: InnerProps;

  constructor(props: InnerProps) {
    this[propsSymbol] = props;
  }

  static create(props: InnerProps | undefined | null) {
    if (!props) return null;
    return new Props(props);
  }

  /**
   * id
   */
  get id() {
    return this[propsSymbol].id;
  }

  /**
   * 返回当前 props 的路径
   */
  get path() {
    return this[propsSymbol].path;
  }

  /**
   * 返回所属的 node 实例
   */
  get node(): Node | null {
    return Node.create(this[propsSymbol].getNode());
  }

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getProp(path: string): Prop | null {
    return Prop.create(this[propsSymbol].getProp(path));
  }

  /**
   * 获取指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getPropValue(path: string) {
    return this.getProp(path)?.getValue();
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraProp(path: string): Prop | null {
    return Prop.create(this[propsSymbol].getProp(getConvertedExtraKey(path)));
  }

  /**
   * 获取指定 path 的属性模型实例值
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string) {
    return this.getExtraProp(path)?.getValue();
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setPropValue(path: string, value: CompositeValue) {
    return this.getProp(path)?.setValue(value);
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setExtraPropValue(path: string, value: CompositeValue) {
    return this.getExtraProp(path)?.setValue(value);
  }

  /**
   * test if the specified key is existing or not.
   * @param key
   * @returns
   */
  has(key: string) {
    return this[propsSymbol].has(key);
  }

  /**
   * add a key with given value
   * @param value
   * @param key
   * @returns
   */
  add(value: CompositeValue, key?: string | number | undefined) {
    return this[propsSymbol].add(value, key);
  }
}