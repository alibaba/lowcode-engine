import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import TreeNode from '../tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';
import { ModalNodesManager } from '@ali/lowcode-designer';
import { IconEyeClose } from '../icons/eye-close';

@observer
class ModalTreeNodeView extends Component<{ treeNode: TreeNode }> {
  private modalNodesManager: ModalNodesManager;

  constructor(props: any) {
    super(props);

    // 模态管理对象
    this.modalNodesManager = props.treeNode.document.modalNodesManager;
  }

  shouldComponentUpdate() {
    return false;
  }

  hideAllNodes() {
    this.modalNodesManager.hideModalNodes();
  }

  render() {
    const { treeNode } = this.props;
    const modalNodes = treeNode.children?.filter((item) => {
      return item.node.getPrototype()?.isModal();
    });
    if (!modalNodes || modalNodes.length === 0) {
      return null;
    }

    const hasVisibleModalNode = !!this.modalNodesManager.getVisibleModalNode();
    return (
      <div className="tree-node-modal">
        <div className="tree-node-modal-title">
          <span>模态视图层</span>
          <div
            className="tree-node-modal-title-visible-icon"
            onClick={this.hideAllNodes.bind(this)}
          >
            {hasVisibleModalNode ? <IconEyeClose /> : null}
          </div>
        </div>
        <div className="tree-pane-modal-content">
          <TreeBranches treeNode={treeNode} isModal />
        </div>
      </div>
    );
  }
}

@observer
export default class RootTreeNodeView extends Component<{ treeNode: TreeNode }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { treeNode } = this.props;
    const className = classNames('tree-node', {
      // 是否展开
      expanded: treeNode.expanded,
      // 是否悬停中
      detecting: treeNode.detecting,
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
        <ModalTreeNodeView treeNode={treeNode} />
        <TreeBranches treeNode={treeNode} />
      </div>
    );
  }
}
