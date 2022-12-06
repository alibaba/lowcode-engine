import { DOMText } from '../schema';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isDOMText(data: any): data is DOMText {
  return typeof data === 'string';
}
