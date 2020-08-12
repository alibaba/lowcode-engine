import _ from 'lodash';
import {
  PIECE_TYPE,
  CodeGeneratorError,
  CodePiece,
  HandlerSet,
  ExtGeneratorPlugin,
  isJSExpression,
  isJSFunction,
  NodeData,
  CompositeValue,
  NodeSchema,
} from '../types';
import { CustomHandlerSet, generateCompositeType } from './compositeType';
import { generateExpression } from './jsExpression';

// tslint:disable-next-line: no-empty
const noop = () => [];

export function handleChildren(children: NodeData | NodeData[], handlers: HandlerSet<string>): string[] {
  if (Array.isArray(children)) {
    return children.map((child) => handleChildren(child, handlers)).reduce((p, c) => p.concat(c), []);
  } else if (typeof children === 'string') {
    const handler = handlers.string || handlers.common || noop;
    return handler(children);
  } else if (isJSExpression(children)) {
    const handler = handlers.expression || handlers.common || noop;
    return ['{', ...handler(children), '}'];
  } else if (isJSFunction(children)) {
    const handler = handlers.function || handlers.common || noop;
    return handler(children);
  } else {
    const handler = handlers.node || handlers.common || noop;
    return handler(children);
  }
}

export function generateAttr(attrName: string, attrValue: CompositeValue, handlers: CustomHandlerSet): CodePiece[] {
  if (attrName === 'initValue' || attrName === 'labelCol') {
    return [];
  }
  const [isString, valueStr] = generateCompositeType(attrValue, handlers);
  return [
    {
      value: `${attrName}=${isString ? `"${valueStr}"` : `{${valueStr}}`}`,
      type: PIECE_TYPE.ATTR,
    },
  ];
}

export function generateAttrs(nodeItem: NodeSchema, handlers: CustomHandlerSet): CodePiece[] {
  const { props } = nodeItem;

  let pieces: CodePiece[] = [];

  if (props) {
    if (!Array.isArray(props)) {
      Object.keys(props).forEach((propName: string) => {
        pieces = pieces.concat(generateAttr(propName, props[propName], handlers));
      });
    } else {
      props.forEach((prop) => {
        if (prop.name && !prop.spread) {
          pieces = pieces.concat(generateAttr(prop.name, prop.value, handlers));
        }

        // TODO: 处理 spread 场景（<Xxx {...(something)}/>)
      });
    }
  }

  return pieces;
}

export function mapNodeName(src: string): string {
  if (src === 'Div') {
    return 'div';
  }

  return src;
}

export function generateBasicNode(nodeItem: NodeSchema): CodePiece[] {
  const pieces: CodePiece[] = [];
  pieces.push({
    value: mapNodeName(nodeItem.componentName),
    type: PIECE_TYPE.TAG,
  });

  return pieces;
}

export function generateReactCtrlLine(nodeItem: NodeSchema, handlers: CustomHandlerSet): CodePiece[] {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop) {
    const loopItemName = nodeItem.loopArgs?.[0] || 'item';
    const loopIndexName = nodeItem.loopArgs?.[1] || 'index';

    // TODO: 静态的值可以抽离出来？
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
    const [isString, value] = generateCompositeType(nodeItem.condition, handlers);
    const conditionExpr = (handlers.conditionExpr || _.identity)(isString ? `'${value}'` : value);

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
  customHandlers: CustomHandlerSet = {},
) {
  const generateNode = (nodeItem: NodeSchema): string => {
    let pieces: CodePiece[] = [];

    plugins.forEach((p) => {
      pieces = pieces.concat(p(nodeItem, customHandlers));
    });

    pieces = pieces.concat(generateBasicNode(nodeItem));
    pieces = pieces.concat(generateAttrs(nodeItem, customHandlers));

    if (nodeItem.children && !_.isEmpty(nodeItem.children)) {
      pieces = pieces.concat(
        handleChildren(nodeItem.children, handlers).map((l) => ({
          type: PIECE_TYPE.CHILDREN,
          value: l,
        })),
      );
    }

    return linkPieces(pieces, customHandlers);
  };

  handlers.node = (node: NodeSchema) => [generateNode(node)];

  customHandlers.node = customHandlers.node || generateNode;

  return generateNode;
}

export const generateString = (input: string) => [input];

export function createReactNodeGenerator() {
  return createNodeGenerator(
    {
      string: generateString,
      expression: (input) => [generateExpression(input)],
    },
    [generateReactCtrlLine],
  );
}
