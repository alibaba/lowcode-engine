import { Node } from '../../document';

/**
 * 获取离当前节点最近的可点击节点
 * @param currentNode
 * @param event
 */
export const getClosestClickableNode = (
  currentNode: Node | undefined | null,
  event: MouseEvent,
) => {
  let node = currentNode;
  // 执行 onClickHook 来判断当前节点是否可点击
  while (node) {
    const onClickHook = node.componentMeta?.getMetadata()?.experimental?.callbacks?.onClickHook;
    const canClick =
      onClickHook && typeof onClickHook === 'function' ? onClickHook(event, node) : true;
    if (canClick) {
      break;
    }
    // 对于不可点击的节点, 继续向上找
    node = node.parent;
  }
  return node;
};
