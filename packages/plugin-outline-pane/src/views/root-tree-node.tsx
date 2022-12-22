import { Component } from 'react';
import classNames from 'classnames';
import TreeNode from '../controllers/tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';
import { IconEyeClose } from '../icons/eye-close';
import { IPublicModelPluginContext, IPublicModelModalNodesManager, IPublicEnumEventNames } from '@alilc/lowcode-types';

class ModalTreeNodeView extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
}> {
  private modalNodesManager: IPublicModelModalNodesManager | undefined | null;
  readonly pluginContext: IPublicModelPluginContext;

  constructor(props: any) {
    super(props);

    // 模态管理对象
    this.pluginContext = props.pluginContext;
    const { project } = this.pluginContext;
    this.modalNodesManager = project.currentDocument?.modalNodesManager;
  }

  hideAllNodes() {
    this.modalNodesManager?.hideModalNodes();
  }

  render() {
    const { treeNode } = this.props;
    // 当指定了新的根节点时，要从原始的根节点去获取模态节点
    const { project } = this.pluginContext;
    const rootNode = project.currentDocument?.root;
    const rootTreeNode = treeNode.tree.getTreeNode(rootNode!);
    const modalNodes = rootTreeNode.children?.filter((item) => {
      return item.node.componentMeta?.isModal;
    });
    if (!modalNodes || modalNodes.length === 0) {
      return null;
    }

    const hasVisibleModalNode = !!this.modalNodesManager?.getVisibleModalNode();
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
          <TreeBranches treeNode={rootTreeNode} isModal pluginContext={this.pluginContext} />
        </div>
      </div>
    );
  }
}

export default class RootTreeNodeView extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
}> {
  state = {
    expanded: false,
    selected: false,
    hidden: false,
    locked: false,
    detecting: false,
    isRoot: false,
    highlight: false,
    dropping: false,
    conditionFlow: false,
  };

  eventOffCallbacks: Array<() => void> = [];

  componentDidMount() {
    const { treeNode, pluginContext } = this.props;
    const { pluginEvent, event } = pluginContext;
    const { id } = treeNode;

    this.state = {
      expanded: false,
      selected: false,
      hidden: false,
      locked: false,
      detecting: false,
      isRoot: treeNode.isRoot(),
      // 是否投放响应
      dropping: treeNode.dropDetail?.index != null,
      conditionFlow: treeNode.node.conditionGroup != null,
      highlight: treeNode.isFocusingNode(),
    };

    const doc = pluginContext.project.currentDocument;

    this.eventOffCallbacks.push(pluginEvent.on('tree-node.hiddenChanged', (payload: any) => {
      const { hidden, nodeId } = payload;
      if (nodeId === id) {
        this.setState({ hidden });
      }
    }));

    this.eventOffCallbacks.push(pluginEvent.on('tree-node.expandedChanged', (payload: any) => {
      const { expanded, nodeId } = payload;
      if (nodeId === id) {
        this.setState({ expanded });
      }
    }));

    this.eventOffCallbacks.push(pluginEvent.on('tree-node.lockedChanged', (payload: any) => {
      const { locked, nodeId } = payload;
      if (nodeId === id) {
        this.setState({ locked });
      }
    }));

    this.eventOffCallbacks.push(
      event.on(
        IPublicEnumEventNames.DOCUMENT_DROPLOCATION_CHANGED,
        (payload: any) => {
          const { document } = payload;
          if (document.id === doc?.id) {
            this.setState({
              dropping: treeNode.dropDetail?.index != null,
            });
          }
        },
      ),
    );

    const offSelectionChange = doc?.selection?.onSelectionChange(() => {
      this.setState({ selected: treeNode.selected });
    });
    this.eventOffCallbacks.push(offSelectionChange!);
    const offDetectingChange = doc?.detecting?.onDetectingChange(() => {
      this.setState({ detecting: treeNode.detecting });
    });
    this.eventOffCallbacks.push(offDetectingChange!);
  }

  componentWillUnmount(): void {
    this.eventOffCallbacks?.forEach((offFun: () => void) => {
      offFun();
    });
  }

  render() {
    const { treeNode } = this.props;
    const className = classNames('tree-node', {
      // 是否展开
      expanded: this.state.expanded,
      // 是否选中的
      selected: this.state.selected,
      // 是否隐藏的
      hidden: this.state.hidden,
      // 是否锁定的
      locked: this.state.locked,
      // 是否悬停中
      detecting: this.state.detecting,
      // 是否投放响应
      dropping: this.state.dropping,
      'is-root': this.state.isRoot,
      'condition-flow': this.state.conditionFlow,
      highlight: this.state.highlight,
    });

    return (
      <div className={className} data-id={treeNode.id}>
        <TreeTitle treeNode={treeNode} pluginContext={this.props.pluginContext} />
        <ModalTreeNodeView treeNode={treeNode} pluginContext={this.props.pluginContext} />
        <TreeBranches treeNode={treeNode} pluginContext={this.props.pluginContext} />
      </div>
    );
  }
}
