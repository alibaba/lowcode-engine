import { IPublicTypeJSExpression } from '@alilc/lowcode-types';
import { isObject } from '../is-object';

/**
 * 为了避免把 { type: 'JSExpression', extType: 'function' } 误判为表达式，故增加如下逻辑。
 *
 * 引擎中关于函数的表达：
 *  开源版本：{ type: 'JSFunction', source: '', value: '' }
 *  内部版本：{ type: 'JSExpression', source: '', value: '', extType: 'function' }
 *  能力是对标的，不过开源的 react-renderer 只认识第一种，而内部只识别第二种（包括 Java 代码、RE）。
 * @param data
 * @returns
 */
export function isJSExpression(data: any): data is IPublicTypeJSExpression {
  if (!isObject(data)) {
    return false;
  }
  return data.type === 'JSExpression' && data.extType !== 'function';
}
