import { IPublicTypeNodeInstance } from '../type/node-instance';
import {
  IPublicModelLocateEvent,
  IPublicModelDropLocation,
  IPublicTypeComponentInstance,
  IPublicModelNode,
} from '..';

/**
 * 拖拽敏感板
 */
export interface IPublicModelSensor<
  Node = IPublicModelNode
> {

  /**
   * 是否可响应，比如面板被隐藏，可设置该值 false
   */
  readonly sensorAvailable: boolean;

  /**
   * 给事件打补丁
   */
  fixEvent(e: IPublicModelLocateEvent): IPublicModelLocateEvent;

  /**
   * 定位并激活
   */
  locate(e: IPublicModelLocateEvent): IPublicModelDropLocation | undefined | null;

  /**
   * 是否进入敏感板区域
   */
  isEnter(e: IPublicModelLocateEvent): boolean;

  /**
   * 取消激活
   */
  deactiveSensor(): void;

  /**
   * 获取节点实例
   */
  getNodeInstanceFromElement?: (e: Element | null) => IPublicTypeNodeInstance<IPublicTypeComponentInstance, Node> | null;
}
