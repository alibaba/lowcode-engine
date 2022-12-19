import { TransformStage } from '../../transform-stage';
import { CompositeValue } from '../../value-type';
import { IPublicModelNode } from './node';

export interface IPublicModelProp {
  /**
   * id
   */
  get id(): string;

  /**
   * key 值
   */
  get key(): string | number | undefined;

  /**
   * 返回当前 prop 的路径
   */
  get path(): any[];

  /**
   * 返回所属的节点实例
   */
  get node(): IPublicModelNode | null;

  /**
   * return the slot node (only if the current prop represents a slot)
   */
  get slotNode(): IPublicModelNode | null;

  /**
   * judge if it is a prop or not
   */
  get isProp(): boolean;

  /**
   * 设置值
   * @param val
   */
  setValue(val: CompositeValue): void;

  /**
   * 获取值
   * @returns
   */
  getValue(): any;

  /**
   * 移除值
   */
  remove(): void;

  /**
   * 导出值
   * @param stage
   * @returns
   */
  exportSchema(stage: TransformStage): CompositeValue;
}
