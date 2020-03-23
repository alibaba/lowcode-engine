import { Component } from 'react';
import { observer } from '../../../globals';
import { Tree } from '../tree';
import TreeNodeView from './tree-node';

@observer
export default class TreeView extends Component<{ tree: Tree }> {
  /*
  hover(e: any) {
    const treeNode = tree.getTreeNodeByEvent(e);

    if (!treeNode) {
      return;
    }

    edging.watch(treeNode.node);
  }

  onClick(e: any) {
    if (this.dragEvent && (this.dragEvent as any).shaken) {
      return;
    }

    const isMulti = e.metaKey || e.ctrlKey;

    const treeNode = tree.getTreeNodeByEvent(e);

    if (!treeNode) {
      return;
    }

    treeNode.select(isMulti);

    // 通知主画板滚动到对应位置
    activeTracker.track(treeNode.node);
  }

  onMouseOver(e: any) {
    if (dragon.dragging) {
      return;
    }

    this.hover(e);
  }

  onMouseUp(e: any) {
    if (dragon.dragging) {
      return;
    }

    this.hover(e);
  }

  onMouseLeave() {
    edging.watch(null);
  }

  componentDidMount(): void {
    if (this.ref.current) {
      dragon.from(this.ref.current, (e: MouseEvent) => {
        this.dragEvent = e;

        const treeNode = tree.getTreeNodeByEvent(e);
        if (treeNode) {
          return {
            type: DragTargetType.Nodes,
            nodes: [treeNode.node],
          };
        }
        return null;
      });
    }
  }
  */

  render() {
    const { tree } = this.props;
    const root = tree.root;
    return (
      <div className="lc-outline-tree">
        <TreeNodeView key={root.id} treeNode={root} />
      </div>
    );
  }
}
