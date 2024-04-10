// 仅使用类型
import { IPublicModelNode } from '@alilc/lowcode-types';
import { MouseEvent } from 'react';

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
    return getClosestNode(node.parent, until);
  }
};

/**
 * 判断节点是否可被点击
 * @param {Node} node 节点
 * @param {unknown} e 点击事件
 * @returns {boolean} 是否可点击，true表示可点击
 */
export function canClickNode<Node extends IPublicModelNode = IPublicModelNode>(node: Node, e: MouseEvent): boolean {
  const onClickHook = node.componentMeta?.advanced?.callbacks?.onClickHook;
  const canClick = typeof onClickHook === 'function' ? onClickHook(e, node) : true;
  return canClick;
}
