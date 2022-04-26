import { Component } from 'react';
import classNames from 'classnames';
import { observer, Title } from '@alilc/lowcode-editor-core';
import { ExclusiveGroup } from '@alilc/lowcode-designer';
import TreeNode from '../tree-node';
import TreeNodeView from './tree-node';
import { intlNode } from '../locale';

@observer
export default class TreeBranches extends Component<{
  treeNode: TreeNode;
  isModal?: boolean;
}> {
  render() {
    const { treeNode, isModal } = this.props;
    const { expanded } = treeNode;
    const { filterWorking, matchChild } = treeNode.filterReult;
    // 条件过滤生效时，如果命中了子节点，需要将该节点展开
    const expandInFilterResult = filterWorking && matchChild;

    if (!expandInFilterResult && !expanded) {
      return null;
    }

    return (
      <div className="tree-node-branches">
        {
          !isModal && <TreeNodeSlots treeNode={treeNode} />
        }
        <TreeNodeChildren treeNode={treeNode} isModal={isModal || false} />
      </div>
    );
  }
}

@observer
class TreeNodeChildren extends Component<{
    treeNode: TreeNode;
    isModal?: boolean;
  }> {
  render() {
    const { treeNode, isModal } = this.props;
    const children: any = [];
    let groupContents: any[] = [];
    let currentGrp: ExclusiveGroup;
    const { filterWorking, matchSelf, keywords } = treeNode.filterReult;

    const endGroup = () => {
      if (groupContents.length > 0) {
        children.push(
          <div key={currentGrp.id} className="condition-group-container" data-id={currentGrp.firstNode.id}>
            <div className="condition-group-title">
              <Title
                title={currentGrp.title}
                match={filterWorking && matchSelf}
                keywords={keywords}
              />
            </div>
            {groupContents}
          </div>,
        );
        groupContents = [];
      }
    };
    const { dropDetail } = treeNode;
    const dropIndex = dropDetail?.index;
    const insertion = (
      <div
        key="insertion"
        className={classNames('insertion', {
          invalid: dropDetail?.valid === false,
        })}
      />
    );
    treeNode.children?.forEach((child, index) => {
      const childIsModal = child.node.componentMeta.isModal || false;
      if (isModal != childIsModal) {
        return;
      }
      const { conditionGroup } = child.node;
      if (conditionGroup !== currentGrp) {
        endGroup();
      }

      if (conditionGroup) {
        currentGrp = conditionGroup;
        if (index === dropIndex) {
          if (groupContents.length > 0) {
            groupContents.push(insertion);
          } else {
            children.push(insertion);
          }
        }
        groupContents.push(<TreeNodeView key={child.id} treeNode={child} isModal={isModal} />);
      } else {
        if (index === dropIndex) {
          children.push(insertion);
        }
        children.push(<TreeNodeView key={child.id} treeNode={child} isModal={isModal} />);
      }
    });
    endGroup();
    const length = treeNode.children?.length || 0;
    if (dropIndex != null && dropIndex >= length) {
      children.push(insertion);
    }

    return <div className="tree-node-children">{children}</div>;
  }
}

@observer
class TreeNodeSlots extends Component<{
    treeNode: TreeNode;
  }> {
  render() {
    const { treeNode } = this.props;
    if (!treeNode.hasSlots()) {
      return null;
    }
    return (
      <div
        className={classNames('tree-node-slots', {
          'insertion-at-slots': treeNode.dropDetail?.focus?.type === 'slots',
        })}
        data-id={treeNode.id}
      >
        <div className="tree-node-slots-title">
          <Title title={{ type: 'i18n', intl: intlNode('Slots') }} />
        </div>
        {treeNode.slots.map(tnode => (
          <TreeNodeView key={tnode.id} treeNode={tnode} />
        ))}
      </div>
    );
  }
}
