import TreeNode from '../tree-node';

export const FilterType = {
  CONDITION: 'CONDITION',
  LOOP: 'LOOP',
  LOCKED: 'LOCKED',
  HIDDEN: 'HIDDEN',
};

export const FILTER_OPTIONS = [{
  value: FilterType.CONDITION,
  label: '条件渲染',
}, {
  value: FilterType.LOOP,
  label: '循环渲染',
}, {
  value: FilterType.LOCKED,
  label: '已锁定',
}, {
  value: FilterType.HIDDEN,
  label: '已隐藏',
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

  treeNode.setFilterReult({
    filterWorking: true,
    matchChild,
    matchSelf,
    keywords,
  });

  return matchSelf || matchChild;
};
