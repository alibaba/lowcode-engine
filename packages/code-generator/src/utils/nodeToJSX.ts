import _ from 'lodash';
import {
  JSSlot,
  JSExpression,
  NodeData,
  NodeSchema,
  PropsMap,
  isJSExpression,
  isJSSlot,
  isDOMText,
} from '@ali/lowcode-types';

import {
  CodeGeneratorError,
  PIECE_TYPE,
  CodePiece,
  HandlerSet,
  NodeGenerator,
  ExtGeneratorPlugin,
  INodeGeneratorContext,
  INodeGeneratorConfig,
} from '../types';

import { generateCompositeType } from './compositeType';
import { generateExpression } from './jsExpression';

// tslint:disable-next-line: no-empty
const noop = () => [];

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
  } else if (isDOMText(children)) {
    const handler = handlers.string || handlers.common || noop;
    return handler(children as string);
  } else if (isJSExpression(children)) {
    const handler = handlers.expression || handlers.common || noop;
    return handler(children as JSExpression);
  } else {
    const handler = handlers.node || handlers.common || noop;
    const child = children as NodeSchema;
    let curRes = handler(child);
    if (opt.rerun && child.children) {
      const childRes = handleSubNodes(child.children, handlers, opt);
      curRes = curRes.concat(childRes || []);
    }
    if (child.props) {
      // FIXME: currently only support PropsMap
      const childProps = child.props as PropsMap;
      Object.keys(childProps)
        .filter((propName) => isJSSlot(childProps[propName]))
        .forEach((propName) => {
          const soltVals = (childProps[propName] as JSSlot).value;
          const childRes = handleSubNodes(soltVals, handlers, opt);
          curRes = curRes.concat(childRes || []);
        });
    }
    return curRes;
  }
}

export function handleChildren<T>(
  ctx: INodeGeneratorContext,
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
    return list.map((child) => handleChildren(ctx, child, handlers, opt)).reduce((p, c) => p.concat(c), []);
  } else if (isDOMText(children)) {
    const handler = handlers.string || handlers.common || noop;
    return handler(children as string);
  } else if (isJSExpression(children)) {
    const handler = handlers.expression || handlers.common || noop;
    return handler(children as JSExpression);
  } else {
    const handler = handlers.node || handlers.common || noop;
    const child = children as NodeSchema;
    let curRes = handler(child);
    if (opt.rerun && child.children) {
      const childRes = handleChildren(ctx, child.children, handlers, opt);
      curRes = curRes.concat(childRes || []);
    }
    return curRes;
  }
}

export function generateAttr(ctx: INodeGeneratorContext, attrName: string, attrValue: any): CodePiece[] {
  if (attrName === 'initValue') {
    return [];
  }
  const valueStr = generateCompositeType(attrValue, {
    containerHandlers: {
      default: (v) => `{${v}}`,
      string: (v) => `"${v}"`,
    },
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
      });
    }
  }

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
  nodeItem: NodeSchema,
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
 * @param {NodeSchema} nodeItem 当前 UI 节点
 * @returns {CodePiece[]} 实现功能的相关代码片段
 */
export function generateReactCtrlLine(ctx: INodeGeneratorContext, nodeItem: NodeSchema): CodePiece[] {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop) {
    const loopItemName = nodeItem.loopArgs?.[0] || 'item';
    const loopIndexName = nodeItem.loopArgs?.[1] || 'index';

    const loopDataExpr = (handlers.loopDataExpr || _.identity)(
      isJSExpression(nodeItem.loop) ? `(${nodeItem.loop.value})` : `(${JSON.stringify(nodeItem.loop)})`,
    );

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

    const conditionExpr = (handlers.conditionExpr || _.identity)(value);

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

export function linkPieces(pieces: CodePiece[], handlers: CustomHandlerSet): string {
  const tagsPieces = pieces.filter((p) => p.type === PIECE_TYPE.TAG);
  if (tagsPieces.length !== 1) {
    throw new CodeGeneratorError('One node only need one tag define');
  }

  const tagName = (handlers.tagName || _.identity)(tagsPieces[0].value);

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

  const generateNode = (nodeItem: NodeSchema): string => {
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

    return linkPieces(pieces, customHandlers);
  };

  handlers.node = (input: NodeSchema) => [generateNode(input)];

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
