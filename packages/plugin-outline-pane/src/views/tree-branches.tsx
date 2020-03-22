import { observer } from '../../../globals/src';

@observer
export default class TreeBranches extends Component<TreeNodeProps> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const treeNode = this.props.treeNode;
    const { expanded } = treeNode;

    if (!expanded) {
      return null;
    }

    const branchClassName = classNames({
      branches: !isRootNode(treeNode.node),
      // 'x-branch': treeNode.hasXIf() && treeNode.branchIndex !== treeNode.branchNode!.children.length - 1,
    });

    let children: any = [];

    if (treeNode.hasChildren() /* || node.hasSlots() */) {
      children = treeNode.children.map((child: TreeNode) => {
        if (child.hasXIf()) {
          if (child.flowIndex === 0) {
            const conditionFlowContainer = classNames('condition-group-container', {
              hidden: child.hidden,
            });
            return (
              <div key={child.id} className={conditionFlowContainer} data-id={child.id}>
                <div className="c-control-flow-title"><b>Condition Flow</b></div>
                {child.conditionGroup!.children.map(c => {
                  return <TreeNodeView key={c.id} treeNode={tree.getTreeNode(c)} />;
                })}
              </div>
            );
          } else {
            return null;
          }
        }
        return <TreeNodeView key={child.id} treeNode={child} />;
      });
    }
    if (treeNode.dropIndex != null) {
      children.splice(
        treeNode.dropIndex,
        0,
        <div key="insertion" ref={ref => tree.mountInsertion(ref)} className="insertion" />,
      );
    }

    return children.length > 0 && <div className={branchClassName}>{children}</div>;
  }
}
