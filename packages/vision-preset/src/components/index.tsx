import { Overlay } from '@alifd/next';
import React from 'react';
import './index.less';
import { Title } from '@ali/lowcode-editor-core';

import { Node, ParentalNode } from '@ali/lowcode-designer';

const { Popup } = Overlay;

export interface IProps {
  node: Node;
}

export interface IState {
  parentNodes: Node[];
}

type UnionNode = Node | ParentalNode | null;

export class InstanceNodeSelector extends React.Component<IProps, IState> {
  state: IState = {
    parentNodes: [],
  };

  componentDidMount() {
    const parentNodes = this.getParentNodes(this.props.node);
    this.setState({
      parentNodes,
    });
  }

  // 获取节点的父级节点（最多获取5层）
  getParentNodes = (node: Node) => {
    const parentNodes = [];
    let currentNode: UnionNode = node;

    while (currentNode && parentNodes.length < 5) {
      currentNode = currentNode.getParent();
      if (currentNode) {
        parentNodes.push(currentNode);
      }
    }
    return parentNodes;
  };

  onSelect = (node: Node) => () => {
    if (node && typeof node.select === 'function') {
      node.select();
    }
  };

  renderNodes = (node: Node) => {
    const nodes = this.state.parentNodes || [];
    const children = nodes.map((node, key) => {
      return (
        <div key={key} onClick={this.onSelect(node)} className="instance-node-selector-node">
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
        >
          <div className="instance-node-selector">{this.renderNodes(node)}</div>
        </Popup>
      </div>
    );
  }
}
