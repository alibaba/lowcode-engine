import TreeNode from './tree-node';
import DocumentModel from '../../designer/src/designer/document/document-model';
import Node from '../../designer/src/designer/document/node/node';

export class Tree {
  private treeNodesMap = new Map<string, TreeNode>();

  readonly root: TreeNode;

  constructor(readonly document: DocumentModel) {
    this.root = this.getTreeNode(document.rootNode);
  }

  getTreeNode(node: Node): TreeNode {
    if (this.treeNodesMap.has(node.id)) {
      return this.treeNodesMap.get(node.id)!;
    }

    const treeNode = new TreeNode(this, node);
    this.treeNodesMap.set(node.id, treeNode);
    return treeNode;
  }
}
