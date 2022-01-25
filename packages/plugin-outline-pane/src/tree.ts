import { DocumentModel, Node } from '@alilc/lowcode-designer';
import { computed, makeObservable } from '@alilc/lowcode-editor-core';
import TreeNode from './tree-node';

export class Tree {
  private treeNodesMap = new Map<string, TreeNode>();

  readonly id: string;

  @computed get root(): TreeNode | null {
    if (this.document.focusNode) {
      return this.getTreeNode(this.document.focusNode!);
    }
    return null;
  }

  constructor(readonly document: DocumentModel) {
    makeObservable(this);
    this.id = document.id;
  }

  getTreeNode(node: Node): TreeNode {
    if (this.treeNodesMap.has(node.id)) {
      const tnode = this.treeNodesMap.get(node.id)!;
      tnode.setNode(node);
      return tnode;
    }

    const treeNode = new TreeNode(this, node);
    this.treeNodesMap.set(node.id, treeNode);
    return treeNode;
  }

  getTreeNodeById(id: string) {
    return this.treeNodesMap.get(id);
  }
}
