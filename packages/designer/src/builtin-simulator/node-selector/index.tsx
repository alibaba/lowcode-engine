import { Overlay } from '@alifd/next';
import React, { MouseEvent } from 'react';
import { Title } from '@alilc/lowcode-editor-core';
import { canClickNode } from '@alilc/lowcode-utils';
import './index.less';

import { INode } from '@alilc/lowcode-designer';

const { Popup } = Overlay;

export interface IProps {
  node: INode;
}

export interface IState {
  parentNodes: INode[];
}

type UnionNode = INode | null;

export default class InstanceNodeSelector extends React.Component<IProps, IState> {
  state: IState = {
    parentNodes: [],
  };

  componentDidMount() {
    const parentNodes = this.getParentNodes(this.props.node);
    this.setState({
      parentNodes: parentNodes ?? [],
    });
  }

  // 获取节点的父级节点（最多获取 5 层）
  getParentNodes = (node: INode) => {
    const parentNodes: any[] = [];
    const focusNode = node.document?.focusNode;

    if (!focusNode) {
      return null;
    }

    if (node.contains(focusNode) || !focusNode.contains(node)) {
      return parentNodes;
    }

    let currentNode: UnionNode = node;

    while (currentNode && parentNodes.length < 5) {
      currentNode = currentNode.getParent();
      if (currentNode) {
        parentNodes.push(currentNode);
      }
      if (currentNode === focusNode) {
        break;
      }
    }
    return parentNodes;
  };

  onSelect = (node: INode) => (event: MouseEvent) => {
    if (!node) {
      return;
    }

    const canClick = canClickNode(node.internalToShellNode()!, event);

    if (canClick && typeof node.select === 'function') {
      node.select();
      const editor = node.document?.designer.editor;
      const npm = node?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        node?.componentMeta?.componentName ||
        '';
      editor?.eventBus.emit('designer.border.action', {
        name: 'select',
        selected,
      });
    }
  };

  onMouseOver = (node: INode) => (_: any, flag = true) => {
    if (node && typeof node.hover === 'function') {
      node.hover(flag);
    }
  };

  onMouseOut = (node: INode) => (_: any, flag = false) => {
    if (node && typeof node.hover === 'function') {
      node.hover(flag);
    }
  };

  renderNodes = () => {
    const nodes = this.state.parentNodes;
    if (!nodes || nodes.length < 1) {
      return null;
    }
    const children = nodes.map((node, key) => {
      return (
        <div
          key={key}
          onClick={this.onSelect(node)}
          onMouseEnter={this.onMouseOver(node)}
          onMouseLeave={this.onMouseOut(node)}
          className="instance-node-selector-node"
        >
          <div className="instance-node-selector-node-content">
            <Title
              className="instance-node-selector-node-title"
              title={{
                label: node.title,
                icon: node.icon,
              }}
            />
          </div>
        </div>
      );
    });
    return children;
  };

  render() {
    const { node } = this.props;
    return (
      <div className="instance-node-selector">
        <Popup
          trigger={
            <div className="instance-node-selector-current">
              <Title
                className="instance-node-selector-node-title"
                title={{
                  label: node.title,
                  icon: node.icon,
                }}
              />
            </div>
          }
          triggerType="hover"
          offset={[0, 0]}
        >
          <div className="instance-node-selector">{this.renderNodes()}</div>
        </Popup>
      </div>
    );
  }
}
