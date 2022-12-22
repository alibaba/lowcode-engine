import TreeNode from './tree-node';
import { IPublicModelNode, IPublicModelPluginContext } from '@alilc/lowcode-types';

export class Tree {
  private treeNodesMap = new Map<string, TreeNode>();

  readonly id: string | undefined;

  readonly pluginContext: IPublicModelPluginContext;

  get root(): TreeNode | null {
    if (this.pluginContext.project.currentDocument?.focusNode) {
      return this.getTreeNode(this.pluginContext.project.currentDocument.focusNode!);
    }
    return null;
  }

  constructor(pluginContext: IPublicModelPluginContext) {
    this.pluginContext = pluginContext;
    this.id = this.pluginContext.project.currentDocument?.id;
  }

  getTreeNode(node: IPublicModelNode): TreeNode {
    if (this.treeNodesMap.has(node.id)) {
      const tnode = this.treeNodesMap.get(node.id)!;
      tnode.setNode(node);
      return tnode;
    }

    const treeNode = new TreeNode(this, node, this.pluginContext);
    this.treeNodesMap.set(node.id, treeNode);
    return treeNode;
  }

  getTreeNodeById(id: string) {
    return this.treeNodesMap.get(id);
  }

  expandAllDecendants(treeNode: TreeNode | undefined) {
    if (!treeNode) {
      return;
    }
    treeNode.setExpanded(true);
    const children = treeNode && treeNode.children;
    if (children) {
      children.forEach((child) => {
        this.expandAllDecendants(child);
      });
    }
  }

  collapseAllDecendants(treeNode: TreeNode | undefined) {
    if (!treeNode) {
      return;
    }
    treeNode.setExpanded(false);
    const children = treeNode && treeNode.children;
    if (children) {
      children.forEach((child) => {
        this.collapseAllDecendants(child);
      });
    }
  }
}
