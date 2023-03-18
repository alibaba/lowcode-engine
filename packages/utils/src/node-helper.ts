// 仅使用类型
import { IPublicModelNode } from '@alilc/lowcode-types';

export const getClosestNode = <Node extends IPublicModelNode = IPublicModelNode>(
  node: Node,
  until: (n: Node) => boolean,
  ): Node | undefined => {
  if (!node) {
    return undefined;
  }
  if (until(node)) {
    return node;
  } else {
    // @ts-ignore
    return getClosestNode(node.getParent(), until);
  }
};

/**
 * 判断节点是否可被点击
 * @param {Node} node 节点
 * @param {unknown} e 点击事件
 * @returns {boolean} 是否可点击，true表示可点击
 */
export function canClickNode<Node extends IPublicModelNode = IPublicModelNode>(node: Node, e: unknown): boolean {
  const onClickHook = node.componentMeta?.advanced?.callbacks?.onClickHook;
  const canClick = typeof onClickHook === 'function' ? onClickHook(e as MouseEvent, node) : true;
  return canClick;
};
