import { IPublicModelNode } from './';

export interface IPublicModelModalNodesManager {
  /**
   * 设置模态节点，触发内部事件
   */
  setNodes(): void;

  /**
   * 获取模态节点（们）
   * @returns
   */
  getModalNodes(): any;

  /**
   * 获取当前可见的模态节点
   * @returns
   */
  getVisibleModalNode(): any;

  /**
   * 隐藏模态节点（们）
   */
  hideModalNodes(): void;

  /**
   * 设置指定节点为可见态
   * @param node Node
   */
  setVisible(node: IPublicModelNode): void;

  /**
   * 设置指定节点为不可见态
   * @param node Node
   */
  setInvisible(node: IPublicModelNode): void;
}
