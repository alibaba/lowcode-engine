import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '../../../globals';
import TreeNode from '../tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';

@observer
export default class TreeNodeView extends Component<{ treeNode: TreeNode }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { treeNode } = this.props;
    const className = classNames('tree-node', {
      // 是否展开
      expanded: treeNode.expanded,
      // 是否悬停中
      hovering: treeNode.hovering,
      // 是否选中的
      selected: treeNode.selected,
      // 是否隐藏的
      hidden: treeNode.hidden,
      // 是否忽略的
      // ignored: treeNode.ignored,
      // 是否锁定的
      locked: treeNode.locked,
      // 是否投放响应
      dropping: treeNode.dropDetail?.index != null,
      'is-root': treeNode.isRoot(),
      'condition-flow': treeNode.node.conditionGroup != null,
      highlight: treeNode.isFocusingNode(),
    });

    return (
      <div className={className} data-id={treeNode.id}>
        <TreeTitle treeNode={treeNode} />
        <TreeBranches treeNode={treeNode} />
      </div>
    );
  }
}
