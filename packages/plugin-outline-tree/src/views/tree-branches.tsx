import { observer, Title } from '../../../globals';
import { Component } from 'react';
import TreeNode from '../tree-node';
import TreeNodeView from './tree-node';
import ExclusiveGroup from '../../../designer/src/designer/document/node/exclusive-group';
import { intl } from '../locale';

@observer
export default class TreeBranches extends Component<{
  treeNode: TreeNode;
}> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const treeNode = this.props.treeNode;
    const { expanded } = treeNode;

    if (!expanded) {
      return null;
    }

    return (
      <div className="tree-node-branches">
        <TreeNodeSlots treeNode={treeNode} />
        <TreeNodeChildren treeNode={treeNode} />
      </div>
    );
  }
}

@observer
class TreeNodeChildren extends Component<{
  treeNode: TreeNode;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    let children: any = [];
    let groupContents: any[] = [];
    let currentGrp: ExclusiveGroup;
    const endGroup = () => {
      if (groupContents.length > 0) {
        children.push(
          <div key={currentGrp.id} className="condition-group-container" data-id={currentGrp.firstNode.id}>
            <div className="condition-group-title">
              <Title title={currentGrp.title} />
            </div>
            {groupContents}
          </div>,
        );
        groupContents = [];
      }
    };
    const { dropIndex } = treeNode;
    treeNode.children?.forEach((child, index) => {
      const { conditionGroup } = child.node;
      if (conditionGroup !== currentGrp) {
        endGroup();
      }

      if (conditionGroup) {
        currentGrp = conditionGroup;
        if (index === dropIndex) {
          if (groupContents.length > 0) {
            groupContents.push(<div key="insertion" className="insertion" />);
          } else {
            children.push(<div key="insertion" className="insertion" />);
          }
        }
        groupContents.push(<TreeNodeView key={child.id} treeNode={child} />);
      } else {
        if (index === dropIndex) {
          children.push(<div key="insertion" className="insertion" />);
        }
        children.push(<TreeNodeView key={child.id} treeNode={child} />);
      }
    });
    endGroup();
    if (dropIndex != null && dropIndex === treeNode.children?.length) {
      children.push(<div key="insertion" className="insertion" />);
    }

    return <div className="tree-node-children">{children}</div>;
  }
}

@observer
class TreeNodeSlots extends Component<{
  treeNode: TreeNode;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    if (!treeNode.isSlotContainer()) {
      return null;
    }
    return (
      <div className="tree-node-slots">
        <div className="tree-node-slots-title">
          <Title title={{ type: 'i18n', intl: intl('Slots')}} />
        </div>
        {treeNode.slots.map(tnode => (
          <TreeNodeView key={tnode.id} treeNode={tnode} />
        ))}
      </div>
    );
  }
}
