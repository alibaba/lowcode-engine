import { JSSlot, isJSSlot, NodeData } from '@ali/lowcode-types';
import { CodeGeneratorError, NodeGenerator, IScope } from '../types';
import { unwrapJsExprQuoteInJsx } from './jsxHelpers';

function generateSingleLineComment(commentText: string): string {
  return `/* ${commentText.split('\n').join(' ').replace(/\*\//g, '*-/')}*/`;
}

export function generateJsSlot(slot: any, scope: IScope, generator: NodeGenerator<string>): string {
  if (isJSSlot(slot)) {
    const { title, params, value } = slot as JSSlot;
    const subScope = scope.createSubScope(params || []);
    const contentExpr = !value
      ? 'null'
      : generateNodeDataOrArrayForJsSlot(value, generator, subScope);
    if (params) {
      return [
        title && generateSingleLineComment(title),
        '(',
        (params || []).join(', '),
        ') => ((__$$context) => (',
        contentExpr,
        '))(',
        `  __$$createChildContext(__$$context, { ${(params || []).join(', ')} }`,
        '))',
      ]
        .filter(Boolean)
        .join('');
    }

    return contentExpr || '[]';
  }

  throw new CodeGeneratorError('Not a JSSlot');
}

function generateNodeDataOrArrayForJsSlot(
  value: NodeData | NodeData[],
  generator: NodeGenerator<string>,
  scope: IScope,
) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }

    if (value.length === 1) {
      return unwrapJsExprQuoteInJsx(generator(value, scope)) || 'null';
    }

    return `[\n${
      value
        .map((v) => {
          if (typeof v === 'string') {
            return JSON.stringify(v);
          }

          return unwrapJsExprQuoteInJsx(generator(v, scope)) || 'null';
        })
        .join(',\n') || 'null'
    }\n]`;
  }

  return unwrapJsExprQuoteInJsx(generator(value, scope)) || 'null';
}
