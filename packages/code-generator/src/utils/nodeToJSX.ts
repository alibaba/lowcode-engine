import _ from 'lodash';
import {
  JSSlot,
  JSExpression,
  NodeData,
  NodeSchema,
  isNodeSchema,
  PropsMap,
  isJSExpression,
  isJSSlot,
  isDOMText,
  NodeDataType,
} from '@ali/lowcode-types';

import {
  CodeGeneratorError,
  PIECE_TYPE,
  CodePiece,
  HandlerSet,
  NodeGenerator,
  INodeGeneratorContext,
  NodeGeneratorConfig,
} from '../types';

import { generateCompositeType } from './compositeType';

// tslint:disable-next-line: no-empty
const noop = () => undefined;

const handleChildrenDefaultOptions = {
  rerun: false,
};

export function handleSubNodes<T>(
  children: unknown,
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
    const list: NodeData[] = children as NodeData[];
    return list.map((child) => handleSubNodes(child, handlers, opt)).reduce((p, c) => p.concat(c), []);
  }

  let result: T | undefined = undefined;
  const childrenRes: T[] = [];
  if (isDOMText(children)) {
    const handler = handlers.string || handlers.common || noop;
    result = handler(children as string);
  } else if (isJSExpression(children)) {
    const handler = handlers.expression || handlers.common || noop;
    result = handler(children as JSExpression);
  } else {
    const handler = handlers.node || handlers.common || noop;
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

export function generateAttr(ctx: INodeGeneratorContext, attrName: string, attrValue: any): CodePiece[] {
  if (ctx.handlers.nodeAttr) {
    return ctx.handlers.nodeAttr(attrName, attrValue);
  }

  const valueStr = generateCompositeType(attrValue, {
    containerHandler: (v, isStr, vStr) => (isStr ? `"${vStr}"` : `{${v}}`),
    nodeGenerator: ctx.generator,
  });

  return [
    {
      value: `${attrName}=${valueStr}`,
      type: PIECE_TYPE.ATTR,
    },
  ];
}

export function generateAttrs(ctx: INodeGeneratorContext, nodeItem: NodeSchema): CodePiece[] {
  if (ctx.handlers.nodeAttrs) {
    return ctx.handlers.nodeAttrs(nodeItem);
  }

  const { props } = nodeItem;

  let pieces: CodePiece[] = [];

  if (props) {
    if (!Array.isArray(props)) {
      Object.keys(props).forEach((propName: string) => {
        pieces = pieces.concat(generateAttr(ctx, propName, props[propName]));
      });
    } else {
      props.forEach((prop) => {
        if (prop.name && !prop.spread) {
          pieces = pieces.concat(generateAttr(ctx, prop.name, prop.value));
        }

        // TODO: 处理 spread 场景（<Xxx {...(something)}/>)
        // 这种在 schema 里面怎么描述
      });
    }
  }

  return pieces;
}

export function generateBasicNode(ctx: INodeGeneratorContext, nodeItem: NodeSchema): CodePiece[] {
  const pieces: CodePiece[] = [];
  const tagName = (ctx.handlers.tagName || _.identity)(nodeItem.componentName);

  pieces.push({
    value: tagName || '', // FIXME: type detection error
    type: PIECE_TYPE.TAG,
  });

  return pieces;
}

export function linkPieces(pieces: CodePiece[]): string {
  const tagsPieces = pieces.filter((p) => p.type === PIECE_TYPE.TAG);
  if (tagsPieces.length !== 1) {
    throw new CodeGeneratorError('One node only need one tag define');
  }
  const tagName = tagsPieces[0].value;

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

export function generateNodeSchema(nodeItem: NodeSchema, ctx: INodeGeneratorContext): string {
  let pieces: CodePiece[] = [];

  ctx.plugins.forEach((p) => {
    pieces = pieces.concat(p(ctx, nodeItem));
  });
  pieces = pieces.concat(generateBasicNode(ctx, nodeItem));
  pieces = pieces.concat(generateAttrs(ctx, nodeItem));

  if (nodeItem.children) {
    const childrenStr = ctx.generator(nodeItem.children);

    pieces.push({
      type: PIECE_TYPE.CHILDREN,
      value: childrenStr,
    });
  }

  return linkPieces(pieces);
}

// TODO: 生成文档
// 为包裹的代码片段生成子上下文，集成父级上下文，并传入子级上下文新增内容。（如果存在多级上下文怎么处理？）
// 创建新的上下文，并从作用域中取对应同名变量塞到作用域里面？
// export function createSubContext() {}

/**
 * JSX 生成逻辑插件。在 React 代码模式下生成 loop 与 condition 相关的逻辑代码
 * @type ExtGeneratorPlugin
 *
 * @export
 * @param {NodeSchema} nodeItem 当前 UI 节点
 * @returns {CodePiece[]} 实现功能的相关代码片段
 */
export function generateReactCtrlLine(ctx: INodeGeneratorContext, nodeItem: NodeSchema): CodePiece[] {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop) {
    const loopItemName = nodeItem.loopArgs?.[0] || 'item';
    const loopIndexName = nodeItem.loopArgs?.[1] || 'index';

    const rawLoopDataExpr = isJSExpression(nodeItem.loop)
      ? `(${nodeItem.loop.value})`
      : `(${JSON.stringify(nodeItem.loop)})`;

    const loopDataExpr = ctx.handlers.loopDataExpr ? ctx.handlers.loopDataExpr(rawLoopDataExpr) : rawLoopDataExpr;

    pieces.unshift({
      value: `${loopDataExpr}.map((${loopItemName}, ${loopIndexName}) => (`,
      type: PIECE_TYPE.BEFORE,
    });

    pieces.push({
      value: '))',
      type: PIECE_TYPE.AFTER,
    });
  }

  if (nodeItem.condition) {
    const value = generateCompositeType(nodeItem.condition, {
      nodeGenerator: ctx.generator,
    });

    const conditionExpr = (ctx.handlers.conditionExpr || _.identity)(value);

    pieces.unshift({
      value: `(${conditionExpr}) && (`,
      type: PIECE_TYPE.BEFORE,
    });

    pieces.push({
      value: ')',
      type: PIECE_TYPE.AFTER,
    });
  }

  if (nodeItem.condition || nodeItem.loop) {
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

const handleChildren = (v: string[]) => v.join('');

export function createNodeGenerator(cfg: NodeGeneratorConfig = {}): NodeGenerator {
  let ctx: INodeGeneratorContext = { handlers: {}, plugins: [], generator: () => '' };

  const generateNode = (nodeItem: NodeDataType): string => {
    if (_.isArray(nodeItem)) {
      const resList = nodeItem.map((n) => generateNode(n));
      return (cfg?.handlers?.children || handleChildren)(resList);
    }

    if (isNodeSchema(nodeItem)) {
      if (cfg?.handlers?.node) {
        // TODO: children 的处理是否拆出来作为公用
        return cfg.handlers.node(nodeItem);
      }

      return generateNodeSchema(nodeItem, ctx);
    }

    return generateCompositeType(nodeItem, {
      handlers: cfg.handlers,
      // FIXME: 这里和 children 类型的嵌套逻辑需要再思考一下
      // containerHandler: (value: string, isString: boolean, valStr: string) => (isString ? valStr : value),
      nodeGenerator: generateNode,
    });
  };

  ctx = {
    handlers: cfg?.handlers || {},
    plugins: cfg.plugins || [],
    generator: generateNode,
  };

  return generateNode;
}

// TODO: 需要一个 merge config 的方法。
export function createReactNodeGenerator(cfg?: NodeGeneratorConfig): NodeGenerator {
  return createNodeGenerator({
    plugins: [generateReactCtrlLine],
    ...cfg,
  });
}
