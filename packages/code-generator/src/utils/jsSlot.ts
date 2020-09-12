import { JSSlot, isJSSlot } from '@ali/lowcode-types';
import { CodeGeneratorError, NodeGenerator, IScope } from '../types';

function generateSingleLineComment(commentText: string): string {
  return (
    `/* ${
      commentText
        .split('\n')
        .join(' ')
        .replace(/\*\//g, '*-/')
    }*/`
  );
}

export function generateJsSlot(slot: any, scope: IScope, generator: NodeGenerator<string>): string {
  if (isJSSlot(slot)) {
    const { title, params, value } = slot as JSSlot;
    if (params) {
      return [
        title && generateSingleLineComment(title),
        '(',
        ...(params || []),
        ') => (',
        !value ? 'null' : generator(value, scope),
        ')',
      ]
        .filter(Boolean)
        .join('');
    }

    return !value ? 'null' : generator(value, scope);
  }

  throw new CodeGeneratorError('Not a JSSlot');
}
