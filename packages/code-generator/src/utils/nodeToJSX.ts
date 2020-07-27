import {
  ChildNodeType,
  IComponentNodeItem,
  IJSExpression,
  ChildNodeItem,
  CodeGeneratorError,
  PIECE_TYPE,
  CodePiece,
  HandlerSet,
  ExtGeneratorPlugin,
  INodeGeneratorConfig,
  INodeGeneratorContext,
  NodeGenerator,
} from '../types';
import { generateCompositeType } from './compositeType';
import { generateExpression, isJsExpression } from './jsExpression';

// tslint:disable-next-line: no-empty
const noop = () => [];

const handleChildrenDefaultOptions = {
  rerun: false,
};

export function handleSubNodes<T>(
  children: ChildNodeType,
  handlers: HandlerSet<T>,
  options?: {
    rerun?: boolean;
  },
): T[] {
  const opt = {
    ...handleChildrenDefaultOptions,
    ...(options || {}),
  };

  if (Array.isArray(children)) {
    const list: ChildNodeItem[] = children as ChildNodeItem[];
    return list.map((child) => handleSubNodes(child, handlers, opt)).reduce((p, c) => p.concat(c), []);
  } else if (typeof children === 'string') {
    const handler = handlers.string || handlers.common || noop;
    return handler(children as string);
  } else if (isJsExpression(children)) {
    const handler = handlers.expression || handlers.common || noop;
    return handler(children as IJSExpression);
  } else {
    const handler = handlers.node || handlers.common || noop;
    let curRes = handler(children as IComponentNodeItem);
    if (opt.rerun && children.children) {
      const childRes = handleSubNodes(children.children, handlers, opt);
      curRes = curRes.concat(childRes || []);
    }
    return curRes;
  }
}

export function handleChildren<T>(
  ctx: INodeGeneratorContext,
  children: ChildNodeType,
  handlers: HandlerSet<T>,
  options?: {
    rerun?: boolean;
  },
): T[] {
  const opt = {
    ...handleChildrenDefaultOptions,
    ...(options || {}),
  };

  if (Array.isArray(children)) {
    const list: ChildNodeItem[] = children as ChildNodeItem[];
    return list.map((child) => handleChildren(ctx, child, handlers, opt)).reduce((p, c) => p.concat(c), []);
  } else if (typeof children === 'string') {
    const handler = handlers.string || handlers.common || noop;
    return handler(children as string);
  } else if (isJsExpression(children)) {
    const handler = handlers.expression || handlers.common || noop;
    return handler(children as IJSExpression);
  } else {
    const handler = handlers.node || handlers.common || noop;
    let curRes = handler(children as IComponentNodeItem);
    if (opt.rerun && children.children) {
      const childRes = handleChildren(ctx, children.children, handlers, opt);
      curRes = curRes.concat(childRes || []);
    }
    return curRes;
  }
}

export function generateAttr(ctx: INodeGeneratorContext, attrName: string, attrValue: any): CodePiece[] {
  if (attrName === 'initValue') {
    return [];
  }
  const [isString, valueStr] = generateCompositeType(attrValue, {
    nodeGenerator: ctx.generator,
  });
  return [
    {
      value: `${attrName}=${isString ? `"${valueStr}"` : `{${valueStr}}`}`,
      type: PIECE_TYPE.ATTR,
    },
  ];
}

export function generateAttrs(ctx: INodeGeneratorContext, nodeItem: IComponentNodeItem): CodePiece[] {
  const { props } = nodeItem;
  let pieces: CodePiece[] = [];

  Object.keys(props).forEach(
    (propName: string) => (pieces = pieces.concat(generateAttr(ctx, propName, props[propName]))),
  );

  return pieces;
}

function mapNodeName(src: string, mapping: Record<string, string>): string {
  if (mapping[src]) {
    return mapping[src];
  }
  return src;
}

export function generateBasicNode(
  ctx: INodeGeneratorContext,
  nodeItem: IComponentNodeItem,
  mapping: Record<string, string>,
): CodePiece[] {
  const pieces: CodePiece[] = [];
  pieces.push({
    value: mapNodeName(nodeItem.componentName, mapping),
    type: PIECE_TYPE.TAG,
  });

  return pieces;
}

// TODO: 生成文档
// 为包裹的代码片段生成子上下文，集成父级上下文，并传入子级上下文新增内容。（如果存在多级上下文怎么处理？）
// 创建新的上下文，并从作用域中取对应同名变量塞到作用域里面？
// export function createSubContext() {}

/**
 * JSX 生成逻辑插件。在 React 代码模式下生成 loop 与 condition 相关的逻辑代码
 *
 * @export
 * @param {IComponentNodeItem} nodeItem 当前 UI 节点
 * @returns {CodePiece[]} 实现功能的相关代码片段
 */
export function generateReactCtrlLine(ctx: INodeGeneratorContext, nodeItem: IComponentNodeItem): CodePiece[] {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop && nodeItem.loopArgs) {
    let loopDataExp;
    if (isJsExpression(nodeItem.loop)) {
      loopDataExp = `(${generateExpression(nodeItem.loop)})`;
    } else {
      loopDataExp = JSON.stringify(nodeItem.loop);
    }
    pieces.unshift({
      value: `${loopDataExp}.map((${nodeItem.loopArgs[0]}, ${nodeItem.loopArgs[1]}) => (`,
      type: PIECE_TYPE.BEFORE,
    });
    pieces.push({
      value: '))',
      type: PIECE_TYPE.AFTER,
    });
  }

  if (nodeItem.condition) {
    const [isString, value] = generateCompositeType(nodeItem.condition, {
      nodeGenerator: ctx.generator,
    });

    pieces.unshift({
      value: `(${isString ? `'${value}'` : value}) && (`,
      type: PIECE_TYPE.BEFORE,
    });
    pieces.push({
      value: ')',
      type: PIECE_TYPE.AFTER,
    });
  }

  if (nodeItem.condition || (nodeItem.loop && nodeItem.loopArgs)) {
    pieces.unshift({
      value: '{',
      type: PIECE_TYPE.BEFORE,
    });
    pieces.push({
      value: '}',
      type: PIECE_TYPE.AFTER,
    });
  }

  return pieces;
}

export function linkPieces(pieces: CodePiece[]): string {
  if (pieces.filter((p) => p.type === PIECE_TYPE.TAG).length !== 1) {
    throw new CodeGeneratorError('One node only need one tag define');
  }
  const tagName = pieces.filter((p) => p.type === PIECE_TYPE.TAG)[0].value;

  const beforeParts = pieces
    .filter((p) => p.type === PIECE_TYPE.BEFORE)
    .map((p) => p.value)
    .join('');

  const afterParts = pieces
    .filter((p) => p.type === PIECE_TYPE.AFTER)
    .map((p) => p.value)
    .join('');

  const childrenParts = pieces
    .filter((p) => p.type === PIECE_TYPE.CHILDREN)
    .map((p) => p.value)
    .join('');

  let attrsParts = pieces
    .filter((p) => p.type === PIECE_TYPE.ATTR)
    .map((p) => p.value)
    .join(' ');

  attrsParts = !!attrsParts ? ` ${attrsParts}` : '';

  if (childrenParts) {
    return `${beforeParts}<${tagName}${attrsParts}>${childrenParts}</${tagName}>${afterParts}`;
  }

  return `${beforeParts}<${tagName}${attrsParts} />${afterParts}`;
}

export function createNodeGenerator(
  handlers: HandlerSet<string>,
  plugins: ExtGeneratorPlugin[],
  cfg?: INodeGeneratorConfig,
): NodeGenerator {
  let nodeTypeMapping: Record<string, string> = {};
  if (cfg && cfg.nodeTypeMapping) {
    nodeTypeMapping = cfg.nodeTypeMapping;
  }

  const generateNode = (nodeItem: IComponentNodeItem): string => {
    let pieces: CodePiece[] = [];
    const ctx: INodeGeneratorContext = {
      generator: generateNode,
    };

    plugins.forEach((p) => {
      pieces = pieces.concat(p(ctx, nodeItem));
    });
    pieces = pieces.concat(generateBasicNode(ctx, nodeItem, nodeTypeMapping));
    pieces = pieces.concat(generateAttrs(ctx, nodeItem));
    if (nodeItem.children && (nodeItem.children as unknown[]).length > 0) {
      pieces = pieces.concat(
        handleChildren<string>(ctx, nodeItem.children, handlers).map((l) => ({
          type: PIECE_TYPE.CHILDREN,
          value: l,
        })),
      );
    }

    return linkPieces(pieces);
  };

  handlers.node = (input: IComponentNodeItem) => [generateNode(input)];

  return generateNode;
}

export const generateString = (input: string) => [input];

export function createReactNodeGenerator(cfg?: INodeGeneratorConfig): NodeGenerator {
  return createNodeGenerator(
    {
      string: generateString,
      expression: (input) => [generateExpression(input)],
    },
    [generateReactCtrlLine],
    cfg,
  );
}
