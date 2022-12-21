import { IPublicModelNode } from './';

export interface IPublicModelDetecting {

  /**
   * 控制大纲树 hover 时是否出现悬停效果
   */
  get enable(): boolean;

  /**
   * 当前 hover 的节点
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

  onDetectingChange(fn: (node: IPublicModelNode) => void): () => void;
}
