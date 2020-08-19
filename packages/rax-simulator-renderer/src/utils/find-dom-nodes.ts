import { isElement } from '@ali/lowcode-utils';
import findDOMNode from 'rax-find-dom-node';
// import { isDOMNode } from './is-dom-node';

export function raxFindDOMNodes(instance: any): Array<Element | Text> | null {
  if (!instance) {
    return null;
  }
  if (isElement(instance)) {
    return [instance];
  }
  const result = findDOMNode(instance);
  if (Array.isArray(result)) {
    return result;
  }
  return [result];
}
