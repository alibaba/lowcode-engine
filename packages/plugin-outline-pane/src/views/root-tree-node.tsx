import TreeNodeView from './tree-node';
import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import TreeNode from '../tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';
import { ModalNodesManager } from '@ali/lowcode-designer';
import { IconEyeClose } from '../icons/eye-close';
import { IconEye } from '../icons/eye';

@observer
class ModalTreeNodeView extends Component<{ treeNode: TreeNode }> {
  private modalNodesManager: ModalNodesManager;

  constructor(props: any) {
    super(props);

    // 模态管理对象
    this.modalNodesManager = props.treeNode.document.modalNodesManager;
    if (!this.modalNodesManager) {
      return;
    }

    // 当前选中的节点
    let selectedNode;
    const modalNodes = this.modalNodesManager.getModalNodes();
    if (modalNodes && modalNodes.length > 0) {
      const visibleModalNode = this.modalNodesManager.getVisibleModalNode();
      if (visibleModalNode) {
        selectedNode = visibleModalNode;
      } else {
        selectedNode = modalNodes[0];
      }
    }

    this.state = {
      selectedNode,
    };
  }

  // componentWillMount() {
  //   if (!this.modalNodesManager) {
  //     return;
  //   }

  //   this.willDetach = [
  //     this.modalNodesManager.onModalNodesChange(() => {
  //       console.log('onModalNodesChange');
  //       setTimeout(() => {
  //         this.modalNodesChangeHandler();
  //       });
  //     }),
  //     this.modalNodesManager.onVisibleChange(() => {
  //       console.log('onVisibleChange');
  //       this.modalNodesChangeHandler();
  //     }),
  //   ];
  // }

  shouldComponentUpdate() {
    return false;
  }

  // componentWillUnmount() {
  //   if (this.willDetach) {
  //     this.willDetach.forEach((off: any) => {
  //       off();
  //     });
  //   }
  // }

  // // 模态节点改变的处理函数
  // modalNodesChangeHandler() {
  //   if (!this.modalNodesManager) {
  //     return;
  //   }
  //   const visibleNode = this.modalNodesManager.getVisibleModalNode();
  //   if (visibleNode) {
  //     this.setState({
  //       selectedNode: visibleNode,
  //     });
  //   }
  //   this.forceUpdate();
  // }

  // selectNode(leaf) {
  //   this.modalNodesManager.setVisible(leaf.getNode());
  // }

  hideAllNodes() {
    this.modalNodesManager.hideModalNodes();
  }

  render() {
    const { treeNode } = this.props;
    const hasVisibleModalNode = !!this.modalNodesManager.getVisibleModalNode();
    return (
      <div className="tree-node-modal">
        <div className="tree-node-modal-title">
          <span>模态视图层</span>
          <div className="tree-node-modal-title-visible-icon"
            onClick={this.hideAllNodes.bind(this)}>
            {hasVisibleModalNode ? <IconEyeClose /> : null}
          </div>
        </div>
        <div className="tree-pane-modal-content">
          <TreeBranches treeNode={treeNode} isModal={true}/>
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
        <TreeBranches treeNode={treeNode}/>
      </div>
    );
  }
}
