import { DocumentModel, Node } from '@ali/lowcode-designer';
import { computed } from '@ali/lowcode-editor-core';
import TreeNode from './tree-node';

export class Tree {
  private treeNodesMap = new Map<string, TreeNode>();

  readonly id: string;

  @computed get root(): TreeNode {
    return this.getTreeNode(this.document.focusNode);
  }

  constructor(readonly document: DocumentModel) {
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
