import { IPublicTypeJSFunction } from '@alilc/lowcode-types';
import { isObject } from '../is-object';

interface InnerJsFunction {
  type: 'JSExpression';
  source: string;
  value: string;
  extType: 'function';
}

/**
 *  内部版本 的 { type: 'JSExpression', source: '', value: '', extType: 'function' } 能力上等同于 JSFunction
 */
export function isInnerJsFunction(data: any): data is InnerJsFunction {
  if (!isObject(data)) {
    return false;
  }
  return data.type === 'JSExpression' && data.extType === 'function';
}

export function isJSFunction(data: any): data is IPublicTypeJSFunction {
  if (!isObject(data)) {
    return false;
  }
  return data.type === 'JSFunction' || isInnerJsFunction(data);
}
