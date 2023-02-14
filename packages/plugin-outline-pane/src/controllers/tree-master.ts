import { isLocationChildrenDetail } from '@alilc/lowcode-utils';
import { IPublicModelPluginContext, IPublicTypeActiveTarget, IPublicModelNode } from '@alilc/lowcode-types';
import TreeNode from './tree-node';
import { Tree } from './tree';

export interface ITreeBoard {
  readonly at: string | symbol;
  scrollToNode(treeNode: TreeNode, detail?: any): void;
}

export class TreeMaster {
  readonly pluginContext: IPublicModelPluginContext;

  private boards = new Set<ITreeBoard>();

  private treeMap = new Map<string, Tree>();

  constructor(pluginContext: IPublicModelPluginContext) {
    this.pluginContext = pluginContext;
    let startTime: any;
    const { event, project, canvas } = this.pluginContext;
    canvas.dragon?.onDragstart(() => {
      startTime = Date.now() / 1000;
      // needs?
      this.toVision();
    });
    canvas.activeTracker?.onChange((target: IPublicTypeActiveTarget) => {
      const { node, detail } = target;
      const tree = this.currentTree;
      if (!tree/* || node.document !== tree.document */) {
        return;
      }
      const treeNode = tree.getTreeNode(node);
      if (detail && isLocationChildrenDetail(detail)) {
        treeNode.expand(true);
      } else {
        treeNode.expandParents();
      }
      this.boards.forEach((board) => {
        board.scrollToNode(treeNode, detail);
      });
    });
    canvas.dragon?.onDragend(() => {
      const endTime: any = Date.now() / 1000;
      const nodes = project.currentDocument?.selection?.getNodes();
      event.emit('outlinePane.dragend', {
        selected: nodes
          ?.map((n) => {
            if (!n) {
              return;
            }
            const npm = n?.componentMeta?.npm;
            return (
              [npm?.package, npm?.componentName].filter((item) => !!item).join('-') || n?.componentMeta?.componentName
            );
          })
          .join('&'),
        time: (endTime - startTime).toFixed(2),
      });
    });
    project.onRemoveDocument((data: {id: string}) => {
      const { id } = data;
      this.treeMap.delete(id);
    });
  }

  private toVision() {
    const tree = this.currentTree;
    if (tree) {
      const selection = this.pluginContext.project.getCurrentDocument()?.selection;
      selection?.getTopNodes().forEach((node: IPublicModelNode) => {
        tree.getTreeNode(node).setExpanded(false);
      });
    }
  }

  addBoard(board: ITreeBoard) {
    this.boards.add(board);
  }

  removeBoard(board: ITreeBoard) {
    this.boards.delete(board);
  }

  purge() {
    // todo others purge
  }

  get currentTree(): Tree | null {
    const doc = this.pluginContext.project.getCurrentDocument();
    if (doc) {
      const { id } = doc;
      if (this.treeMap.has(id)) {
        return this.treeMap.get(id)!;
      }
      const tree = new Tree(this.pluginContext);
      this.treeMap.set(id, tree);
      return tree;
    }
    return null;
  }
}
