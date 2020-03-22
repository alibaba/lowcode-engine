import { INode, isElementNode, isRootNode } from '../../../../document/node';

export function isContainer(node: INode): boolean {
  if (isRootNode(node)) {
    return true;
  }
  if (isElementNode(node)) {
    // TODO: check from  prototype
    // block  Fragment
    return true;
  }
  return false;
}
