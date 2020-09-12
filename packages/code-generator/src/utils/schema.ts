import {
  JSSlot,
  JSExpression,
  NodeData,
  NodeSchema,
  PropsMap,
  isJSExpression,
  isJSSlot,
  isDOMText,
  ContainerSchema,
  NpmInfo,
} from '@ali/lowcode-types';

export function isContainerSchema(x: any): x is ContainerSchema {
  return typeof x === 'object' && x && typeof x.componentName === 'string' && typeof x.fileName === 'string';
}

export function isNpmInfo(x: any): x is NpmInfo {
  return typeof x === 'object' && x && typeof x.package === 'string';
}

// tslint:disable-next-line: no-empty
const noop = () => undefined;

const handleChildrenDefaultOptions = {
  rerun: false,
};

export function handleSubNodes<T>(
  children: unknown,
  handlers: {
    string?: (i: string) => T;
    expression?: (i: JSExpression) => T;
    node?: (i: NodeSchema) => T;
  },
  options?: {
    rerun?: boolean;
  },
): T[] {
  const opt = {
    ...handleChildrenDefaultOptions,
    ...(options || {}),
  };

  if (Array.isArray(children)) {
    const list: NodeData[] = children as NodeData[];
    return list.map(
      (child) => handleSubNodes(child, handlers, opt)
    ).reduce((p, c) => p.concat(c), []);
  }

  let result: T | undefined;
  const childrenRes: T[] = [];
  if (isDOMText(children)) {
    const handler = handlers.string || noop;
    result = handler(children as string);
  } else if (isJSExpression(children)) {
    const handler = handlers.expression || noop;
    result = handler(children as JSExpression);
  } else {
    const handler = handlers.node || noop;
    const child = children as NodeSchema;
    result = handler(child);

    if (opt.rerun && child.children) {
      const childRes = handleSubNodes(child.children, handlers, opt);
      childrenRes.push(...childRes);
    }
    if (child.props) {
      // FIXME: currently only support PropsMap
      const childProps = child.props as PropsMap;
      Object.keys(childProps)
        .filter((propName) => isJSSlot(childProps[propName]))
        .forEach((propName) => {
          const soltVals = (childProps[propName] as JSSlot).value;
          const childRes = handleSubNodes(soltVals, handlers, opt);
          childrenRes.push(...childRes);
        });
    }
  }

  if (result !== undefined) {
    childrenRes.unshift(result);
  }

  return childrenRes;
}
