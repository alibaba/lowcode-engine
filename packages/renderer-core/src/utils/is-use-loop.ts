import { IPublicTypeJSExpression } from '@alilc/lowcode-types';
import { isJSExpression } from '@alilc/lowcode-utils';

// 1.渲染模式下，loop 是数组，则按照数组长度渲染组件
// 2.设计模式下，loop 需要长度大于 0，按照循环模式渲染，防止无法设计的情况
export default function isUseLoop(loop: null | any[] | IPublicTypeJSExpression, isDesignMode: boolean): boolean {
  if (isJSExpression(loop)) {
    return true;
  }

  if (!isDesignMode) {
    return true;
  }

  if (!Array.isArray(loop)) {
    return false;
  }

  return loop.length > 0;
}
