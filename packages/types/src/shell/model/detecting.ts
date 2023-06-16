import { IPublicModelNode } from './';
import { IPublicTypeDisposable } from '../type';

export interface IPublicModelDetecting<Node = IPublicModelNode> {

  /**
   * 是否启用
   * check if current detecting is enabled
   * @since v1.1.0
   */
  get enable(): boolean;

  /**
   * 当前 hover 的节点
   * get current hovering node
   * @since v1.0.16
   */
  get current(): Node | null;

  /**
   * hover 指定节点
   * capture node with nodeId
   * @param id 节点 id
   */
  capture(id: string): void;

  /**
   * hover 离开指定节点
   * release node with nodeId
   * @param id 节点 id
   */
  release(id: string): void;

  /**
   * 清空 hover 态
   * clear all hover state
   */
  leave(): void;

  /**
   * hover 节点变化事件
   * set callback which will be called when hovering object changed.
   * @since v1.1.0
   */
  onDetectingChange(fn: (node: Node | null) => void): IPublicTypeDisposable;
}
