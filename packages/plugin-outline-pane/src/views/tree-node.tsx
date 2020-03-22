

export interface TreeNodeProps {
  treeNode: TreeNode;
}

@observer
export default class TreeNodeView extends Component<TreeNodeProps> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { treeNode } = this.props;
    const className = classNames('tree-node', {
      // 是否展开
      expanded: treeNode.expanded,
      // 是否悬停
      hover: treeNode.hover,
      // 是否选中
      selected: treeNode.selected,
      // 是否隐藏
      hidden: treeNode.hidden,
      // 是否忽略的
      ignored: treeNode.ignored,
      // 是否锁定的
      locked: treeNode.locked,
      // 是否投放响应
      dropping: treeNode.dropIndex != null,
      // 是否?
      highlight: treeNode.isDropContainer() && treeNode.dropIndex == null,
    });

    return (
      <div className={className} data-id={treeNode.id}>
        <TreeTitle treeNode={treeNode} />
        <TreeBranches treeNode={treeNode} />
      </div>
    );
  }
}

export function findTargetByEvent(e: MouseEvent): HTMLElement | null {
  return (e.target as HTMLElement).closest('.tree-node') as HTMLElement;
}

export function getNodeIDFromTarget(target: HTMLElement): string | null {
  return target.getAttribute('data-id');
}

export function getNodeIDByEvent(e: MouseEvent): string | null {
  const target = findTargetByEvent(e);
  if (target) {
    return getNodeIDFromTarget(target);
  }

  return null;
}
