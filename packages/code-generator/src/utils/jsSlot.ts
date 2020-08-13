import { JSSlot, isJSSlot } from '@ali/lowcode-types';
import { CodeGeneratorError, NodeGenerator } from '../types';

function generateSingleLineComment(commentText: string): string {
  return (
    '/* ' +
    commentText
      .split('\n')
      .join(' ')
      .replace(/\*\//g, '*-/') +
    '*/'
  );
}

export function generateJsSlot(slot: any, generator: NodeGenerator): string {
  if (isJSSlot(slot)) {
    const { title, params, value } = slot as JSSlot;
    if (!value) {
      return 'null';
    }

    return [
      title && generateSingleLineComment(title),
      `(`,
      ...(params || []),
      `) => (`,
      ...(!value ? ['null'] : !Array.isArray(value) ? [generator(value)] : value.map((node) => generator(node))),
      `)`,
    ]
      .filter(Boolean)
      .join('');
  }

  throw new CodeGeneratorError('Not a JSSlot');
}
