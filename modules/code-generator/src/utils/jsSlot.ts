import { IPublicTypeJSSlot, isJSSlot, IPublicTypeNodeData } from '@alilc/lowcode-types';
import { CodeGeneratorError, NodeGenerator, IScope } from '../types';
import { unwrapJsExprQuoteInJsx } from './jsxHelpers';

function generateSingleLineComment(commentText: string): string {
  return `/* ${commentText.split('\n').join(' ').replace(/\*\//g, '*-/')}*/`;
}

export function generateJsSlot(slot: any, scope: IScope, generator: NodeGenerator<string>): string {
  if (isJSSlot(slot)) {
    const { title, params, value } = slot as IPublicTypeJSSlot;

    // slot 也是分有参数和无参数的
    // - 有参数的 slot 就是类似一个 render 函数，需要创建子作用域
    // - 无参数的 slot 就是类似一个 JSX 节点，不需要创建子作用域
    const slotScope = params ? scope.createSubScope(params || []) : scope;
    const contentExpr = !value
      ? 'null'
      : generateNodeDataOrArrayForJsSlot(value, generator, slotScope);
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
  value: IPublicTypeNodeData | IPublicTypeNodeData[],
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
