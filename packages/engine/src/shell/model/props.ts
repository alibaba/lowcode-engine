import { IProps as InnerProps, getConvertedExtraKey } from '@alilc/lowcode-designer';
import { IPublicTypeCompositeValue, IPublicModelProps, IPublicModelNode, IPublicModelProp } from '@alilc/lowcode-types';
import { propsSymbol } from '../symbols';
import { Node as ShellNode } from './node';
import { Prop as ShellProp } from './prop';

export class Props implements IPublicModelProps {
  private readonly [propsSymbol]: InnerProps;

  constructor(props: InnerProps) {
    this[propsSymbol] = props;
  }

  static create(props: InnerProps | undefined | null): IPublicModelProps | null {
    if (!props) {
      return null;
    }
    return new Props(props);
  }

  /**
   * id
   */
  get id(): string {
    return this[propsSymbol].id;
  }

  /**
   * 返回当前 props 的路径
   */
  get path(): string[] {
    return this[propsSymbol].path;
  }

  /**
   * 返回所属的 node 实例
   */
  get node(): IPublicModelNode | null {
    return ShellNode.create(this[propsSymbol].getNode());
  }

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getProp(path: string): IPublicModelProp | null {
    return ShellProp.create(this[propsSymbol].getProp(path));
  }

  /**
   * 获取指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getPropValue(path: string): any {
    return this.getProp(path)?.getValue();
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraProp(path: string): IPublicModelProp | null {
    return ShellProp.create(this[propsSymbol].getProp(getConvertedExtraKey(path)));
  }

  /**
   * 获取指定 path 的属性模型实例值
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string): any {
    return this.getExtraProp(path)?.getValue();
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setPropValue(path: string, value: IPublicTypeCompositeValue): void {
    return this.getProp(path)?.setValue(value);
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void {
    return this.getExtraProp(path)?.setValue(value);
  }

  /**
   * test if the specified key is existing or not.
   * @param key
   * @returns
   */
  has(key: string): boolean {
    return this[propsSymbol].has(key);
  }

  /**
   * add a key with given value
   * @param value
   * @param key
   * @returns
   */
  add(value: IPublicTypeCompositeValue, key?: string | number | undefined): any {
    return this[propsSymbol].add(value, key);
  }
}
