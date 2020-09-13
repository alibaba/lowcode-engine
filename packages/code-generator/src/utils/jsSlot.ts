import { CodeGeneratorError, NodeGenerator, IJSSlot } from '../types';

export function isJsSlot(value: unknown): boolean {
  return value && typeof value === 'object' && (value as IJSSlot).type === 'JSSlot';
}

export function generateJsSlot(value: any, generator: NodeGenerator): string {
  if (isJsSlot(value)) {
    const slotCfg = value as IJSSlot;
    if (!slotCfg.value) {
      return 'null';
    }
    const results = slotCfg.value.map((n) => generator(n));
    if (results.length === 1) {
      return results[0];
    }
    return `[${results.join(',')}]`;
  }

  throw new CodeGeneratorError('Not a JSSlot');
}
