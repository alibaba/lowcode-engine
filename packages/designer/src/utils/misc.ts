import Viewport from '../builtin-simulator/viewport';

export function isElementNode(domNode: Element) {
  return domNode.nodeType === Node.ELEMENT_NODE;
}

/**
 * 判断节点是否在 viewport 内，判断依据：只要节点有一部分在 viewport 内，都算 true，其余情况 false
 * @param domNode 待检测的节点
 * @param viewport 画布 viewport
 * @returns 是否在 viewport 内
 */
export function isDOMNodeVisible(domNode: Element, viewport: Viewport) {
  const domNodeRect = domNode.getBoundingClientRect();
  const { width, height } = viewport.contentBounds;
  const { left, right, top, bottom, width: nodeWidth, height: nodeHeight } = domNodeRect;
  return (
    left >= -nodeWidth &&
    top >= -nodeHeight &&
    bottom <= height + nodeHeight &&
    right <= width + nodeWidth
  );
}

/**
 * normalize triggers
 * @param triggers
 */
export function normalizeTriggers(triggers: string[]) {
  return triggers.map((trigger: string) => trigger?.toUpperCase());
}