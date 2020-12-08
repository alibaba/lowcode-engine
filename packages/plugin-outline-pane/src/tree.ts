import { DocumentModel, Node } from '@ali/lowcode-designer';
import TreeNode from './tree-node';

export class Tree {
  private treeNodesMap = new Map<string, TreeNode>();

  readonly root: TreeNode;

  readonly id: string;

  readonly document: DocumentModel;

  constructor(document: DocumentModel) {
    this.document = document;
    this.root = this.getTreeNode(document.rootNode);
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
