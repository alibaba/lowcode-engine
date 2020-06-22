import { Component, MouseEvent as ReactMouseEvent } from 'react';
import { observer, Editor, globalContext } from '@ali/lowcode-editor-core';
import { isRootNode, Node, DragObjectType, isShaken } from '@ali/lowcode-designer';
import { isFormEvent } from '@ali/lowcode-utils';
import { Tree } from '../tree';
import TreeNodeView from './tree-node';

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

@observer
export default class TreeView extends Component<{ tree: Tree }> {
  private shell: HTMLDivElement | null = null;
  private hover(e: ReactMouseEvent) {
    const { tree } = this.props;

    const doc = tree.document;
    const detecting = doc.designer.detecting;
    if (!detecting.enable) {
      return;
    }
    const node = this.getTreeNodeFromEvent(e)?.node;
    detecting.capture(node || null);
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
    const designer = treeNode.designer;
    const doc = node.document;
    const selection = doc.selection;
    const id = node.id;
    const isMulti = e.metaKey || e.ctrlKey || e.shiftKey;
    designer.activeTracker.track(node);
    if (isMulti && !isRootNode(node) && selection.has(id)) {
      if (!isFormEvent(e.nativeEvent)) {
        selection.remove(id);
      }
    } else {
      selection.select(id);
      const editor = globalContext.get(Editor);
      const selectedNode = designer.currentSelection?.getNodes()?.[0];
      const npm = selectedNode?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        selectedNode?.componentMeta?.componentName ||
        '';
      editor?.emit('outlinePane.select', {
        selected,
      });
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

  private ignoreUpSelected = false;
  private boostEvent?: MouseEvent;
  private onMouseDown = (e: ReactMouseEvent) => {
    if (isFormEvent(e.nativeEvent)) {
      return;
    }
    const treeNode = this.getTreeNodeFromEvent(e);
    if (!treeNode) {
      return;
    }

    const { node } = treeNode;
    const designer = treeNode.designer;
    const doc = node.document;
    const selection = doc.selection;

    // TODO: shift selection
    const isMulti = e.metaKey || e.ctrlKey || e.shiftKey;
    const isLeftButton = e.button === 0;

    if (isLeftButton && !isRootNode(node)) {
      let nodes: Node[] = [node];
      this.ignoreUpSelected = false;
      if (isMulti) {
        // multi select mode, directily add
        if (!selection.has(node.id)) {
          designer.activeTracker.track(node);
          selection.add(node.id);
          this.ignoreUpSelected = true;
        }
        selection.remove(doc.rootNode.id);
        // 获得顶层 nodes
        nodes = selection.getTopNodes();
      } else if (selection.has(node.id)) {
        nodes = selection.getTopNodes();
      }
      this.boostEvent = e.nativeEvent;
      designer.dragon.boost(
        {
          type: DragObjectType.Node,
          nodes,
        },
        this.boostEvent,
      );
    }
  };

  private onMouseLeave = () => {
    const { tree } = this.props;
    const doc = tree.document;
    doc.designer.detecting.leave(doc);
  };

  render() {
    const { tree } = this.props;
    const root = tree.root;
    return (
      <div
        className="lc-outline-tree"
        ref={(shell) => (this.shell = shell)}
        onMouseDownCapture={this.onMouseDown}
        onMouseOver={this.onMouseOver}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
      >
        <TreeNodeView key={root.id} treeNode={root} />
      </div>
    );
  }
}
