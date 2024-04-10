import { IProp as InnerProp } from '@alilc/lowcode-designer';
import { IPublicTypeCompositeValue, IPublicEnumTransformStage, IPublicModelProp, IPublicModelNode } from '@alilc/lowcode-types';
import { propSymbol } from '../symbols';
import { Node as ShellNode } from './node';

export class Prop implements IPublicModelProp {
  private readonly [propSymbol]: InnerProp;

  constructor(prop: InnerProp) {
    this[propSymbol] = prop;
  }

  static create(prop: InnerProp | undefined | null): IPublicModelProp | null {
    if (!prop) {
      return null;
    }
    return new Prop(prop);
  }

  /**
   * id
   */
  get id(): string {
    return this[propSymbol].id;
  }

  /**
   * key 值
   * get key of prop
   */
  get key(): string | number | undefined {
    return this[propSymbol].key;
  }

  /**
   * 返回当前 prop 的路径
   */
  get path(): string[] {
    return this[propSymbol].path;
  }

  /**
   * 返回所属的节点实例
   */
  get node(): IPublicModelNode | null {
    return ShellNode.create(this[propSymbol].getNode());
  }

  /**
   * return the slot node (only if the current prop represents a slot)
   */
  get slotNode(): IPublicModelNode | null {
    return ShellNode.create(this[propSymbol].slotNode);
  }

  /**
   * judge if it is a prop or not
   */
  get isProp(): boolean {
    return true;
  }

  /**
   * 设置值
   * @param val
   */
  setValue(val: IPublicTypeCompositeValue): void {
    this[propSymbol].setValue(val);
  }

  /**
   * 获取值
   * @returns
   */
  getValue(): any {
    return this[propSymbol].getValue();
  }

  /**
   * 移除值
   */
  remove(): void {
    this[propSymbol].remove();
  }

  /**
   * 导出值
   * @param stage
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render) {
    return this[propSymbol].export(stage);
  }
}
