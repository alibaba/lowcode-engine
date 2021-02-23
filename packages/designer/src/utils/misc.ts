import Viewport from '../builtin-simulator/viewport';

export function isDOMNodeVisible(domNode: Element, viewport: Viewport) {
  const domNodeRect = domNode.getBoundingClientRect();
  const { width, height } = viewport.contentBounds;
  const { left, right, top, bottom } = domNodeRect;
  return left >= 0 && top >= 0 && bottom <= height && right <= width;
}