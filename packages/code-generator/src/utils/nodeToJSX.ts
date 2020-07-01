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
} from '../types';
import { generateCompositeType } from './compositeType';
import { generateExpression } from './jsExpression';

// tslint:disable-next-line: no-empty
const noop = () => [];

export function handleChildren<T>(
  children: ChildNodeType,
  handlers: HandlerSet<T>,
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

export function generateAttr(attrName: string, attrValue: any): CodePiece[] {
  if (attrName === 'initValue' || attrName === 'labelCol') {
    return [];
  }
  const [isString, valueStr] = generateCompositeType(attrValue);
  return [{
    value: `${attrName}=${isString ? `"${valueStr}"` : `{${valueStr}}`}`,
    type: PIECE_TYPE.ATTR,
  }];
}

export function generateAttrs(nodeItem: IComponentNodeItem): CodePiece[] {
  const { props } = nodeItem;
  let pieces: CodePiece[] = [];

  Object.keys(props).forEach((propName: string) =>
    pieces = pieces.concat(generateAttr(propName, props[propName])),
  );

  return pieces;
}

export function mapNodeName(src: string): string {
  if (src === 'Div') {
    return 'div';
  }
  return src;
}

export function generateBasicNode(nodeItem: IComponentNodeItem): CodePiece[] {
  const pieces: CodePiece[] = [];
  pieces.push({
    value: mapNodeName(nodeItem.componentName),
    type: PIECE_TYPE.TAG,
  });

  return pieces;
}

export function generateReactCtrlLine(nodeItem: IComponentNodeItem): CodePiece[] {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop && nodeItem.loopArgs) {
    let loopDataExp;
    if ((nodeItem.loop as IJSExpression).type === 'JSExpression') {
      loopDataExp = `(${(nodeItem.loop as IJSExpression).value})`;
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
    pieces.unshift({
      value: `(${generateCompositeType(nodeItem.condition)}) && (`,
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
  if (pieces.filter(p => p.type === PIECE_TYPE.TAG).length !== 1) {
    throw new CodeGeneratorError('One node only need one tag define');
  }
  const tagName = pieces.filter(p => p.type === PIECE_TYPE.TAG)[0].value;

  const beforeParts = pieces
    .filter(p => p.type === PIECE_TYPE.BEFORE)
    .map(p => p.value)
    .join('');

  const afterParts = pieces
    .filter(p => p.type === PIECE_TYPE.AFTER)
    .map(p => p.value)
    .join('');

  const childrenParts = pieces
    .filter(p => p.type === PIECE_TYPE.CHILDREN)
    .map(p => p.value)
    .join('');

  let attrsParts = pieces
    .filter(p => p.type === PIECE_TYPE.ATTR)
    .map(p => p.value)
    .join(' ');

  attrsParts = !!attrsParts ? ` ${attrsParts}` : '';

  if (childrenParts) {
    return `${beforeParts}<${tagName}${attrsParts}>${childrenParts}</${tagName}>${afterParts}`;
  }

  return `${beforeParts}<${tagName}${attrsParts} />${afterParts}`;
}

export function createNodeGenerator(handlers: HandlerSet<string>, plugins: ExtGeneratorPlugin[]) {
  const generateNode = (nodeItem: IComponentNodeItem): string => {
    let pieces: CodePiece[] = [];

    plugins.forEach(p => {
      pieces = pieces.concat(p(nodeItem));
    });
    pieces = pieces.concat(generateBasicNode(nodeItem));
    pieces = pieces.concat(generateAttrs(nodeItem));
    if (nodeItem.children && (nodeItem.children as unknown[]).length > 0) {
      pieces = pieces.concat(handleChildren<string>(nodeItem.children, handlers).map(l => ({
        type: PIECE_TYPE.CHILDREN,
        value: l,
      })));
    }

    return linkPieces(pieces);
  };

  handlers.node = (input: IComponentNodeItem) => [generateNode(input)];

  return generateNode;
}

export const generateString = (input: string) => [input];

export function createReactNodeGenerator() {
  return createNodeGenerator({
    string: generateString,
    expression: (input) => [generateExpression(input)],
  }, [
    generateReactCtrlLine,
  ]);
}
