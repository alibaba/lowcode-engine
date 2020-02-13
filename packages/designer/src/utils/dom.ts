export function isDOMNode(node: any): node is Element | Text {
  return node.nodeType && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE);
}

export function isElement(node: any): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

// a range for test TextNode clientRect
const cycleRange = document.createRange();

export function getClientRects(node: Element | Text) {
  if (isElement(node)) {
    return [node.getBoundingClientRect()];
  }

  cycleRange.selectNode(node);
  return Array.from(cycleRange.getClientRects());
}
