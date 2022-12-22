import { Component } from 'react';
import classNames from 'classnames';
import TreeNode from '../controllers/tree-node';
import TreeTitle from './tree-title';
import TreeBranches from './tree-branches';
import { IPublicModelPluginContext, IPublicEnumEventNames } from '@alilc/lowcode-types';

export default class TreeNodeView extends Component<{
  treeNode: TreeNode;
  isModal?: boolean;
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
    const { treeNode, isModal } = this.props;
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

    const { filterWorking, matchChild, matchSelf } = treeNode.filterReult;

    // 条件过滤生效时，如果未命中本节点或子节点，则不展示该节点
    if (filterWorking && !matchChild && !matchSelf) {
      return null;
    }

    return (
      <div className={className} data-id={treeNode.id}>
        <TreeTitle
          treeNode={treeNode}
          isModal={isModal}
          pluginContext={this.props.pluginContext}
        />
        <TreeBranches
          treeNode={treeNode}
          isModal={false}
          pluginContext={this.props.pluginContext}
        />
      </div>
    );
  }
}
