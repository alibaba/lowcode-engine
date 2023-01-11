import { IPublicTypeJSExpression } from '../shell/type/value-type';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isJSExpression(data: any): data is IPublicTypeJSExpression {
  return data && data.type === 'JSExpression' && data.extType !== 'function';
}
