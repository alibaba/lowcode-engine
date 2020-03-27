export function isElement(node: any): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}
