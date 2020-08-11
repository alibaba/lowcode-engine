export function isElement(node: any): node is Element {
  if (!node) return false;
  return node.nodeType === Node.ELEMENT_NODE;
}
