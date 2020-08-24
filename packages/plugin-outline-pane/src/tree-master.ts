import { computed, obx } from '@ali/lowcode-editor-core';
import { Designer, isLocationChildrenDetail } from '@ali/lowcode-designer';
import TreeNode from './tree-node';
import { Tree } from './tree';
import { Backup } from './views/backup-pane';

export interface ITreeBoard {
  readonly visible: boolean;
  readonly at: string | Symbol;
  scrollToNode(treeNode: TreeNode, detail?: any): void;
}

export class TreeMaster {
  constructor(readonly designer: Designer) {
    let startTime: any;
    designer.dragon.onDragstart(() => {
      startTime = Date.now() / 1000;
      // needs?
      this.toVision();
    });
    designer.activeTracker.onChange(({ node, detail }) => {
      const tree = this.currentTree;
      if (!tree || node.document !== tree.document) {
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
    designer.dragon.onDragend(() => {
      const endTime: any = Date.now() / 1000;
      const editor = designer?.editor;
      const nodes = designer.currentSelection?.getNodes();
      editor?.emit('outlinePane.drag', {
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
    designer.editor.on('designer.document.remove', ({ id }) => {
      this.treeMap.delete(id);
    });
  }

  private toVision() {
    const tree = this.currentTree;
    if (tree) {
      tree.document.selection.getTopNodes().forEach((node) => {
        tree.getTreeNode(node).setExpanded(false);
      });
    }
  }

  @obx.val private boards = new Set<ITreeBoard>();
  addBoard(board: ITreeBoard) {
    this.boards.add(board);
  }
  removeBoard(board: ITreeBoard) {
    this.boards.delete(board);
  }

  @computed hasVisibleTreeBoard() {
    for (const item of this.boards) {
      if (item.visible && item.at !== Backup) {
        return true;
      }
    }
    return false;
  }

  purge() {
    // todo others purge
  }

  private treeMap = new Map<string, Tree>();
  @computed get currentTree(): Tree | null {
    const doc = this.designer?.currentDocument;
    if (doc) {
      const id = doc.id;
      if (this.treeMap.has(id)) {
        return this.treeMap.get(id)!;
      }
      const tree = new Tree(doc);
      // TODO: listen purge event to remove
      this.treeMap.set(id, tree);
      return tree;
    }
    return null;
  }
}

const mastersMap = new Map<Designer, TreeMaster>();
export function getTreeMaster(designer: Designer): TreeMaster {
  let master = mastersMap.get(designer);
  if (!master) {
    master = new TreeMaster(designer);
    mastersMap.set(designer, master);
  }
  return master;
}
