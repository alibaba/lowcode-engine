import { IPublicEnumTransformStage } from '../enum';
import { IPublicTypeCompositeValue, IPublicTypeNodeData } from '../type';
import { IPublicModelNode } from './';

export interface IPublicModelProp<
  Node = IPublicModelNode
> {

  /**
   * id
   */
  get id(): string;

  /**
   * key 值
   * get key of prop
   */
  get key(): string | number | undefined;

  /**
   * 返回当前 prop 的路径
   * get path of current prop
   */
  get path(): string[];

  /**
   * 返回所属的节点实例
   * get node instance, which this prop belongs to
   */
  get node(): Node | null;

  /**
   * 当本 prop 代表一个 Slot 时，返回对应的 slotNode
   * return the slot node (only if the current prop represents a slot)
   * @since v1.1.0
   */
  get slotNode(): Node | undefined | null;

  /**
   * 是否是 Prop , 固定返回 true
   * check if it is a prop or not, and of course always return true
   * @experimental
   */
  get isProp(): boolean;

  /**
   * 设置值
   * set value for this prop
   * @param val
   */
  setValue(val: IPublicTypeCompositeValue | IPublicTypeNodeData | IPublicTypeNodeData[]): void;

  /**
   * 获取值
   * get value of this prop
   */
  getValue(): any;

  /**
   * 移除值
   * remove value of this prop
   * @since v1.0.16
   */
  remove(): void;

  /**
   * 导出值
   * export schema
   * @param stage
   */
  exportSchema(stage: IPublicEnumTransformStage): IPublicTypeCompositeValue;
}
