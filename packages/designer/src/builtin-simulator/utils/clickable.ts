import { getClosestNode, canClickNode } from '@alilc/lowcode-utils';
import { INode } from '../../document';

/**
 * 获取离当前节点最近的可点击节点
 * @param currentNode
 * @param event
 */
export const getClosestClickableNode = (
  currentNode: INode | undefined | null,
  event: MouseEvent,
) => {
  let node = currentNode as any;
  while (node) {
    // 判断当前节点是否可点击
    let canClick = canClickNode(node, event as any);
    // eslint-disable-next-line no-loop-func
    const lockedNode: any = getClosestNode(node, (n) => {
      // 假如当前节点就是 locked 状态，要从当前节点的父节点开始查找
      return !!(node?.isLocked ? n.parent?.isLocked : n.isLocked);
    });
    if (lockedNode && lockedNode.getId() !== node.getId()) {
      canClick = false;
    }
    if (canClick) {
      break;
    }
    // 对于不可点击的节点，继续向上找
    node = node.parent;
  }
  return node;
};
