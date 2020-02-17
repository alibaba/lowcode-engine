import { ReactInstance } from 'react';
import { isDOMNode, isElement } from './dom';

const FIBER_KEY = '_reactInternalFiber';

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

export function findDOMNodes(elem: ReactInstance | null): Array<Element | Text> | null {
  if (!elem) {
    return null;
  }
  if (isElement(elem)) {
    return [elem];
  }
  const elements: Array<Element | Text> = [];
  const fiberNode = (elem as any)[FIBER_KEY];
  elementsFromFiber(fiberNode.child, elements);
  return elements.length > 0 ? elements : null;
}
