import {
  ChildNodeItem,
  ChildNodeType,
  IComponentNodeItem,
  IJSExpression,
} from '../types';

// tslint:disable-next-line: no-empty
const noop = () => [];

export function handleChildren<T>(
  children: ChildNodeType,
  handlers: {
    string?: (input: string) => T[];
    expression?: (input: IJSExpression) => T[];
    node?: (input: IComponentNodeItem) => T[];
    common?: (input: unknown) => T[];
  },
): T[] {
  if (Array.isArray(children)) {
    const list: ChildNodeItem[] = children as ChildNodeItem[];
    return list
      .map(child => handleChildren(child, handlers))
      .reduce((p, c) => p.concat(c), []);
  } else if (typeof children === 'string') {
    const handler = handlers.string || handlers.common || noop;
    return handler(children as string);
  } else if ((children as IJSExpression).type === 'JSExpression') {
    const handler = handlers.expression || handlers.common || noop;
    return handler(children as IJSExpression);
  } else {
    const handler = handlers.node || handlers.common || noop;
    return handler(children as IComponentNodeItem);
  }
}
