import TreeNode from '../controllers/tree-node';

export const FilterType = {
  CONDITION: 'CONDITION',
  LOOP: 'LOOP',
  LOCKED: 'LOCKED',
  HIDDEN: 'HIDDEN',
};

export const FILTER_OPTIONS = [{
  value: FilterType.CONDITION,
  label: 'Conditional rendering',
}, {
  value: FilterType.LOOP,
  label: 'Loop rendering',
}, {
  value: FilterType.LOCKED,
  label: 'Locked',
}, {
  value: FilterType.HIDDEN,
  label: 'Hidden',
}];

export const matchTreeNode = (
  treeNode: TreeNode,
  keywords: string,
  filterOps: string[],
): boolean => {
  // 无效节点
  if (!treeNode || !treeNode.node) {
    return false;
  }

  // 过滤条件为空，重置过滤结果
  if (!keywords && filterOps.length === 0) {
    treeNode.setFilterReult({
      filterWorking: false,
      matchChild: false,
      matchSelf: false,
      keywords: '',
    });

    (treeNode.children || []).concat(treeNode.slots || []).forEach((childNode) => {
      matchTreeNode(childNode, keywords, filterOps);
    });

    return false;
  }

  const { node } = treeNode;

  // 命中过滤选项
  const matchFilterOps = filterOps.length === 0 || !!filterOps.find((op: string) => {
    switch (op) {
      case FilterType.CONDITION:
        return node.hasCondition();
      case FilterType.LOOP:
        return node.hasLoop();
      case FilterType.LOCKED:
        return treeNode.locked;
      case FilterType.HIDDEN:
        return treeNode.hidden;
      default:
        return false;
    }
  });

  // 命中节点名
  const matchKeywords = typeof treeNode.titleLabel === 'string' && treeNode.titleLabel.indexOf(keywords) > -1;

  // 同时命中才展示（根结点永远命中）
  const matchSelf = treeNode.isRoot() || (matchFilterOps && matchKeywords);

  // 命中子节点
  const matchChild = !!(treeNode.children || []).concat(treeNode.slots || [])
    .map((childNode: TreeNode) => {
      return matchTreeNode(childNode, keywords, filterOps);
    }).find(Boolean);

  // 如果命中了子节点，需要将该节点展开
  if (matchChild && treeNode.expandable) {
    treeNode.setExpanded(true);
  }

  treeNode.setFilterReult({
    filterWorking: true,
    matchChild,
    matchSelf,
    keywords,
  });

  return matchSelf || matchChild;
};
