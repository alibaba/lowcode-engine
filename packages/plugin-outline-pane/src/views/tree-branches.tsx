import { PureComponent } from 'react';
import classNames from 'classnames';
import TreeNode from '../controllers/tree-node';
import TreeNodeView from './tree-node';
import { IPublicModelExclusiveGroup, IPublicTypeDisposable, IPublicTypeLocationChildrenDetail } from '@alilc/lowcode-types';

export default class TreeBranches extends PureComponent<{
  treeNode: TreeNode;
  isModal?: boolean;
  expanded: boolean;
  treeChildren: TreeNode[] | null;
}> {
  state = {
    filterWorking: false,
    matchChild: false,
  };
  private offExpandedChanged: (() => void) | null;
  constructor(props: any) {
    super(props);

    const { treeNode } = this.props;
    const { filterWorking, matchChild } = treeNode.filterReult;
    this.setState({ filterWorking, matchChild });
  }

  componentDidMount() {
    const { treeNode } = this.props;
    treeNode.onFilterResultChanged(() => {
      const { filterWorking: newFilterWorking, matchChild: newMatchChild } = treeNode.filterReult;
      this.setState({ filterWorking: newFilterWorking, matchChild: newMatchChild });
    });
  }

  componentWillUnmount(): void {
    if (this.offExpandedChanged) {
      this.offExpandedChanged();
    }
  }

  render() {
    const { treeNode, isModal, expanded } = this.props;
    const { filterWorking, matchChild } = this.state;
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
        <TreeNodeChildren
          treeNode={treeNode}
          isModal={isModal || false}
          treeChildren={this.props.treeChildren}
        />
      </div>
    );
  }
}

interface ITreeNodeChildrenState {
  filterWorking: boolean;
  matchSelf: boolean;
  keywords: string | null;
  dropDetail: IPublicTypeLocationChildrenDetail | undefined | null;
}
class TreeNodeChildren extends PureComponent<{
    treeNode: TreeNode;
    isModal?: boolean;
    treeChildren: TreeNode[] | null;
  }, ITreeNodeChildrenState> {
  state: ITreeNodeChildrenState = {
    filterWorking: false,
    matchSelf: false,
    keywords: null,
    dropDetail: null,
  };
  offLocationChanged: IPublicTypeDisposable | undefined;
  componentDidMount() {
    const { treeNode } = this.props;
    const { project } = treeNode.pluginContext;
    const { filterWorking, matchSelf, keywords } = treeNode.filterReult;
    const { dropDetail } = treeNode;
    this.setState({
      filterWorking,
      matchSelf,
      keywords,
      dropDetail,
    });
    treeNode.onFilterResultChanged(() => {
      const {
        filterWorking: newFilterWorking,
        matchSelf: newMatchChild,
        keywords: newKeywords,
       } = treeNode.filterReult;
      this.setState({
        filterWorking: newFilterWorking,
        matchSelf: newMatchChild,
        keywords: newKeywords,
      });
    });
    this.offLocationChanged = project.currentDocument?.onDropLocationChanged(
        () => {
          this.setState({ dropDetail: treeNode.dropDetail });
        },
      );
  }
  componentWillUnmount(): void {
    this.offLocationChanged && this.offLocationChanged();
  }

  render() {
    const { isModal } = this.props;
    const children: any = [];
    let groupContents: any[] = [];
    let currentGrp: IPublicModelExclusiveGroup;
    const { filterWorking, matchSelf, keywords } = this.state;
    const Title = this.props.treeNode.pluginContext.common.editorCabin.Title;

    const endGroup = () => {
      if (groupContents.length > 0) {
        children.push(
          <div key={currentGrp.id} className="condition-group-container" data-id={currentGrp.firstNode?.id}>
            <div className="condition-group-title">
              {/* @ts-ignore */}
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

    const { dropDetail } = this.state;
    const dropIndex = dropDetail?.index;
    const insertion = (
      <div
        key="insertion"
        className={classNames('insertion', {
          invalid: dropDetail?.valid === false,
        })}
      />
    );
    this.props.treeChildren?.forEach((child, index) => {
      const childIsModal = child.node.componentMeta?.isModal || false;
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
        groupContents.push(<TreeNodeView key={child.nodeId} treeNode={child} isModal={isModal} />);
      } else {
        if (index === dropIndex) {
          children.push(insertion);
        }
        children.push(<TreeNodeView key={child.nodeId} treeNode={child} isModal={isModal} />);
      }
    });
    endGroup();
    const length = this.props.treeChildren?.length || 0;
    if (dropIndex != null && dropIndex >= length) {
      children.push(insertion);
    }

    return <div className="tree-node-children">{children}</div>;
  }
}

class TreeNodeSlots extends PureComponent<{
    treeNode: TreeNode;
  }> {
  render() {
    const { treeNode } = this.props;
    if (!treeNode.hasSlots()) {
      return null;
    }
    const Title = this.props.treeNode.pluginContext.common.editorCabin.Title;
    return (
      <div
        className={classNames('tree-node-slots', {
          'insertion-at-slots': treeNode.dropDetail?.focus?.type === 'slots',
        })}
        data-id={treeNode.nodeId}
      >
        <div className="tree-node-slots-title">
          {/* @ts-ignore */}
          <Title title={{ type: 'i18n', intl: this.props.treeNode.pluginContext.intlNode('Slots') }} />
        </div>
        {treeNode.slots.map(tnode => (
          <TreeNodeView key={tnode.nodeId} treeNode={tnode} />
        ))}
      </div>
    );
  }
}
