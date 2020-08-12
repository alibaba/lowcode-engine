import { NodeData, JSSlot, isJSSlot } from '@ali/lowcode-types';
import { CodeGeneratorError, NodeGenerator } from '../types';

export function generateJsSlot(value: any, generator: NodeGenerator): string {
  if (isJSSlot(value)) {
    const slotCfg = value as JSSlot;
    if (!slotCfg.value) {
      return 'null';
    }
    const results: string[] = [];
    if (Array.isArray(slotCfg.value)) {
      const values: NodeData[] = slotCfg.value;
      results.push(...values.map((n) => generator(n)));
    } else {
      results.push(generator(slotCfg.value));
    }

    if (results.length === 1) {
      return results[0];
    }
    return `[${results.join(',')}]`;
  }

  throw new CodeGeneratorError('Not a JSSlot');
}
