import { DOMText } from '@alilc/lowcode-types';

export function isDOMText(data: any): data is DOMText {
  return typeof data === 'string';
}
