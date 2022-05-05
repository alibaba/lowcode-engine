import { Prop as InnerProp } from '@alilc/lowcode-designer';
import { CompositeValue, TransformStage } from '@alilc/lowcode-types';
import { propSymbol } from './symbols';
import Node from './node';

export default class Prop {
  private readonly [propSymbol]: InnerProp;

  constructor(prop: InnerProp) {
    this[propSymbol] = prop;
  }

  static create(prop: InnerProp | undefined | null) {
    if (!prop) return null;
    return new Prop(prop);
  }

  /**
   * id
   */
  get id() {
    return this[propSymbol].id;
  }

  /**
   * key 值
   */
  get key() {
    return this[propSymbol].key;
  }

  /**
   * 返回当前 prop 的路径
   */
  get path() {
    return this[propSymbol].path;
  }

  /**
   * 返回所属的节点实例
   */
  get node(): Node | null {
    return Node.create(this[propSymbol].getNode());
  }

  /**
   * judge if it is a prop or not
   */
  get isProp() { return true; }

  /**
   * 设置值
   * @param val
   */
  setValue(val: CompositeValue) {
    this[propSymbol].setValue(val);
  }

  /**
   * 获取值
   * @returns
   */
  getValue() {
    return this[propSymbol].getValue();
  }

  /**
   * 导出值
   * @param stage
   * @returns
   */
  exportSchema(stage: TransformStage = TransformStage.Render) {
    return this[propSymbol].export(stage);
  }
}