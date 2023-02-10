import { Component } from 'react';
import classNames from 'classnames';
import TreeNode from '../controllers/tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';
import { IconEyeClose } from '../icons/eye-close';
import { IPublicModelPluginContext, IPublicModelModalNodesManager, IPublicModelDocumentModel } from '@alilc/lowcode-types';

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
    const { expanded } = rootTreeNode;

    const hasVisibleModalNode = !!this.modalNodesManager?.getVisibleModalNode();
    return (
      <div className="tree-node-modal">
        <div className="tree-node-modal-title">
          <span>{this.pluginContext.intlNode('Modal View')}</span>
          <div
            className="tree-node-modal-title-visible-icon"
            onClick={this.hideAllNodes.bind(this)}
          >
            {hasVisibleModalNode ? <IconEyeClose /> : null}
          </div>
        </div>
        <div className="tree-pane-modal-content">
          <TreeBranches
            treeNode={rootTreeNode}
            expanded={expanded}
            isModal
            pluginContext={this.pluginContext}
          />
        </div>
      </div>
    );
  }
}

export default class TreeNodeView extends Component<{
  treeNode: TreeNode;
  isModal?: boolean;
  pluginContext: IPublicModelPluginContext;
  isRootNode: boolean;
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
    expandable: false,
  };

  eventOffCallbacks: Array<() => void> = [];
  constructor(props: any) {
    super(props);

    const { treeNode, isRootNode } = this.props;
    this.state = {
      expanded: isRootNode ? true : treeNode.expanded,
      selected: treeNode.selected,
      hidden: treeNode.hidden,
      locked: treeNode.locked,
      detecting: treeNode.detecting,
      isRoot: treeNode.isRoot(),
      // 是否投放响应
      dropping: treeNode.dropDetail?.index != null,
      conditionFlow: treeNode.node.conditionGroup != null,
      highlight: treeNode.isFocusingNode(),
      expandable: treeNode.expandable,
    };
  }

  componentDidMount() {
    const { treeNode, pluginContext } = this.props;
    const { project } = pluginContext;

    const doc = project.currentDocument;

    treeNode.onExpandedChanged = ((expanded: boolean) => {
      this.setState({ expanded });
    });
    treeNode.onHiddenChanged = (hidden: boolean) => {
      this.setState({ hidden });
    };
    treeNode.onLockedChanged = (locked: boolean) => {
      this.setState({ locked });
    };
    treeNode.onExpandableChanged = (expandable: boolean) => {
      this.setState({ expandable });
    };

    this.eventOffCallbacks.push(
      doc?.onDropLocationChanged((document: IPublicModelDocumentModel) => {
        this.setState({
          dropping: treeNode.dropDetail?.index != null,
        });
      }),
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

  shouldShowModalTreeNode(): boolean {
    const { treeNode, isRootNode, pluginContext } = this.props;
    if (!isRootNode) {
      // 只在 当前树 的根节点展示模态节点
      return false;
    }

    // 当指定了新的根节点时，要从原始的根节点去获取模态节点
    const { project } = pluginContext;
    const rootNode = project.currentDocument?.root;
    const rootTreeNode = treeNode.tree.getTreeNode(rootNode!);
    const modalNodes = rootTreeNode.children?.filter((item) => {
      return item.node.componentMeta?.isModal;
    });
    return !!(modalNodes && modalNodes.length > 0);
  }

  render() {
    const { treeNode, isModal, isRootNode } = this.props;
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
    let shouldShowModalTreeNode: boolean = this.shouldShowModalTreeNode();

    // filter 处理
    const { filterWorking, matchChild, matchSelf } = treeNode.filterReult;
    if (!isRootNode && filterWorking && !matchChild && !matchSelf) {
      // 条件过滤生效时，如果未命中本节点或子节点，则不展示该节点
      // 根节点始终展示
      return null;
    }
    return (
      <div
        className={className}
        data-id={treeNode.id}
      >
        <TreeTitle
          treeNode={treeNode}
          isModal={isModal}
          expanded={this.state.expanded}
          hidden={this.state.hidden}
          locked={this.state.locked}
          expandable={this.state.expandable}
          pluginContext={this.props.pluginContext}
        />
        {shouldShowModalTreeNode &&
          <ModalTreeNodeView
            treeNode={treeNode}
            pluginContext={this.props.pluginContext}
          />
        }
        <TreeBranches
          treeNode={treeNode}
          isModal={false}
          expanded={this.state.expanded}
          pluginContext={this.props.pluginContext}
        />
      </div>
    );
  }
}
