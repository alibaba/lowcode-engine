import {
  IModalNodesManager as InnerModalNodesManager,
  INode as InnerNode,
} from '@alilc/lowcode-designer';
import { IPublicModelModalNodesManager, IPublicModelNode } from '@alilc/lowcode-types';
import { Node as ShellNode } from './node';
import { nodeSymbol, modalNodesManagerSymbol } from '../symbols';

export class ModalNodesManager implements IPublicModelModalNodesManager {
  private readonly [modalNodesManagerSymbol]: InnerModalNodesManager;

  constructor(modalNodesManager: InnerModalNodesManager) {
    this[modalNodesManagerSymbol] = modalNodesManager;
  }

  static create(
    modalNodesManager: InnerModalNodesManager | null,
  ): IPublicModelModalNodesManager | null {
    if (!modalNodesManager) {
      return null;
    }
    return new ModalNodesManager(modalNodesManager);
  }

  /**
   * 设置模态节点，触发内部事件
   */
  setNodes(): void {
    this[modalNodesManagerSymbol].setNodes();
  }

  /**
   * 获取模态节点（们）
   */
  getModalNodes(): IPublicModelNode[] {
    const innerNodes = this[modalNodesManagerSymbol].getModalNodes();
    const shellNodes: IPublicModelNode[] = [];
    innerNodes?.forEach((node: InnerNode) => {
      const shellNode = ShellNode.create(node);
      if (shellNode) {
        shellNodes.push(shellNode);
      }
    });
    return shellNodes;
  }

  /**
   * 获取当前可见的模态节点
   */
  getVisibleModalNode(): IPublicModelNode | null {
    return ShellNode.create(this[modalNodesManagerSymbol].getVisibleModalNode());
  }

  /**
   * 隐藏模态节点（们）
   */
  hideModalNodes(): void {
    this[modalNodesManagerSymbol].hideModalNodes();
  }

  /**
   * 设置指定节点为可见态
   * @param node Node
   */
  setVisible(node: IPublicModelNode): void {
    this[modalNodesManagerSymbol].setVisible((node as any)[nodeSymbol]);
  }

  /**
   * 设置指定节点为不可见态
   * @param node Node
   */
   setInvisible(node: IPublicModelNode): void {
    this[modalNodesManagerSymbol].setInvisible((node as any)[nodeSymbol]);
  }
}