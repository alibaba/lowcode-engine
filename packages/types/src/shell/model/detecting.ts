import { IPublicModelNode } from './';

export interface IPublicModelDetecting {

  /**
   * 控制大纲树 hover 时是否出现悬停效果
   */
  get enable(): boolean;

  /**
   * 当前 hover 的节点
   * @since v1.0.16
   */
  get current(): any;

  /**
   * hover 指定节点
   * @param id 节点 id
   */
  capture(id: string): any;

  /**
   * hover 离开指定节点
   * @param id 节点 id
   */
  release(id: string): any;

  /**
   * 清空 hover 态
   */
  leave(): any;

  /**
   * hover 节点变化事件
   * set callback which will be called when hovering object changed.
   * @since v1.1.0
   */
  onDetectingChange(fn: (node: IPublicModelNode) => void): () => void;
}
