import { MouseEvent as ReactMouseEvent, PureComponent } from 'react';
import { isFormEvent, canClickNode, isShaken } from '@alilc/lowcode-utils';
import { Tree } from '../controllers/tree';
import TreeNodeView from './tree-node';
import { IPublicEnumDragObjectType, IPublicModelNode } from '@alilc/lowcode-types';
import TreeNode from '../controllers/tree-node';

function getTreeNodeIdByEvent(e: ReactMouseEvent, stop: Element): null | string {
  let target: Element | null = e.target as Element;
  if (!target || !stop.contains(target)) {
    return null;
  }
  target = target.closest('[data-id]');
  if (!target || !stop.contains(target)) {
    return null;
  }

  return (target as HTMLDivElement).dataset.id || null;
}

export default class TreeView extends PureComponent<{
  tree: Tree;
}> {
  private shell: HTMLDivElement | null = null;

  private ignoreUpSelected = false;

  private boostEvent?: MouseEvent;

  state: {
    root: TreeNode | null;
  } = {
    root: null,
  };

  private hover(e: ReactMouseEvent) {
    const { project } = this.props.tree.pluginContext;
    const detecting = project.currentDocument?.detecting;
    if (detecting?.enable) {
      return;
    }
    const node = this.getTreeNodeFromEvent(e)?.node;
    detecting?.capture(node as any);
  }

  private onClick = (e: ReactMouseEvent) => {
    if (this.ignoreUpSelected) {
      this.boostEvent = undefined;
      return;
    }
    if (this.boostEvent && isShaken(this.boostEvent, e.nativeEvent)) {
      this.boostEvent = undefined;
      return;
    }
    this.boostEvent = undefined;
    const treeNode = this.getTreeNodeFromEvent(e);
    if (!treeNode) {
      return;
    }
    const { node } = treeNode;

    if (!canClickNode(node, e)) {
      return;
    }

    const { project, event, canvas } = this.props.tree.pluginContext;
    const doc = project.currentDocument;
    const selection = doc?.selection;
    const focusNode = doc?.focusNode;
    const { id } = node;
    const isMulti = e.metaKey || e.ctrlKey || e.shiftKey;
    canvas.activeTracker?.track(node);
    if (isMulti && focusNode && !node.contains(focusNode) && selection?.has(id)) {
      if (!isFormEvent(e.nativeEvent)) {
        selection.remove(id);
      }
    } else {
      selection?.select(id);
      const selectedNode = selection?.getNodes()?.[0];
      const npm = selectedNode?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        selectedNode?.componentMeta?.componentName ||
        '';
      event.emit('outlinePane.select', {
        selected,
      });
    }
  };

  private onDoubleClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    const treeNode = this.getTreeNodeFromEvent(e);
    if (treeNode?.id === this.state.root?.id) {
      return;
    }
    if (!treeNode?.expanded) {
      this.props.tree.expandAllDecendants(treeNode);
    } else {
      this.props.tree.collapseAllDecendants(treeNode);
    }
  };

  private onMouseOver = (e: ReactMouseEvent) => {
    this.hover(e);
  };

  private getTreeNodeFromEvent(e: ReactMouseEvent) {
    if (!this.shell) {
      return;
    }
    const id = getTreeNodeIdByEvent(e, this.shell);
    if (!id) {
      return;
    }

    const { tree } = this.props;
    return tree.getTreeNodeById(id);
  }

  private onMouseDown = (e: ReactMouseEvent) => {
    if (isFormEvent(e.nativeEvent)) {
      return;
    }
    const treeNode = this.getTreeNodeFromEvent(e);
    if (!treeNode) {
      return;
    }

    const { node } = treeNode;

    if (!canClickNode(node, e)) {
      return;
    }
    const { project, canvas } = this.props.tree.pluginContext;
    const selection = project.currentDocument?.selection;
    const focusNode = project.currentDocument?.focusNode;

    // TODO: shift selection
    const isMulti = e.metaKey || e.ctrlKey || e.shiftKey;
    const isLeftButton = e.button === 0;

    if (isLeftButton && focusNode && !node.contains(focusNode)) {
      let nodes: IPublicModelNode[] = [node];
      this.ignoreUpSelected = false;
      if (isMulti) {
        // multi select mode, directily add
        if (!selection?.has(node.id)) {
          canvas.activeTracker?.track(node);
          selection?.add(node.id);
          this.ignoreUpSelected = true;
        }
        // todo: remove rootNodes id
        selection?.remove(focusNode.id);
        // 获得顶层 nodes
        if (selection) {
          nodes = selection.getTopNodes();
        }
      } else if (selection?.has(node.id)) {
        nodes = selection.getTopNodes();
      }
      this.boostEvent = e.nativeEvent;
      canvas.dragon?.boost(
        {
          type: IPublicEnumDragObjectType.Node,
          nodes,
        },
        this.boostEvent,
      );
    }
  };

  private onMouseLeave = () => {
    const { pluginContext } = this.props.tree;
    const { project } = pluginContext;
    const doc = project.currentDocument;
    doc?.detecting.leave();
  };

  componentDidMount() {
    const { tree } = this.props;
    const { root } = tree;
    const { project } = tree.pluginContext;
    this.setState({ root });
    const doc = project.currentDocument;
    doc?.onFocusNodeChanged(() => {
      this.setState({
        root: tree.root,
      });
    });
  }

  render() {
    if (!this.state.root) {
      return null;
    }
    return (
      <div
        className="lc-outline-tree"
        ref={(shell) => { this.shell = shell; }}
        onMouseDownCapture={this.onMouseDown}
        onMouseOver={this.onMouseOver}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseLeave={this.onMouseLeave}
      >
        <TreeNodeView
          key={this.state.root?.id}
          treeNode={this.state.root}
          isRootNode
        />
      </div>
    );
  }
}
