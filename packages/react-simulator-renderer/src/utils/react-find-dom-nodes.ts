import { ReactInstance } from 'react';
import { findDOMNode } from 'react-dom';
import { isElement } from '@ali/lowcode-utils';
import { isDOMNode } from './is-dom-node';

export const FIBER_KEY = '_reactInternalFiber';

function elementsFromFiber(fiber: any, elements: Array<Element | Text>) {
  if (fiber) {
    if (fiber.stateNode && isDOMNode(fiber.stateNode)) {
      elements.push(fiber.stateNode);
    } else if (fiber.child) {
      // deep fiberNode.child
      elementsFromFiber(fiber.child, elements);
    }

    if (fiber.sibling) {
      elementsFromFiber(fiber.sibling, elements);
    }
  }
}

export function reactFindDOMNodes(elem: ReactInstance | null): Array<Element | Text> | null {
  if (!elem) {
    return null;
  }
  if (isElement(elem)) {
    return [elem];
  }
  const elements: Array<Element | Text> = [];
  const fiberNode = (elem as any)[FIBER_KEY];
  elementsFromFiber(fiberNode?.child, elements);
  if (elements.length > 0) return elements;
  try {
    return [findDOMNode(elem)];
  } catch (e) {
    return null;
  }
}
