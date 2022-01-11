import { Node } from '@ali/lowcode-engine';
import { hasOwnProperty, isPlainObject } from '@ali/lowcode-utils';

function isEmptyEvent(event: any) {
  return event?.ignored === true;
}

/**
 * 在使用老版的 vu-events-property，会有空的事件描述，比如 onClick: { ignored: true } 的情况
 */
export function filterEmptyEventReducer(props: any, node: Node): any {
  if (!props || !isPlainObject(props)) return props;
  // 基于性能考虑，只过滤第一层
  Object.keys(props).forEach(name => {
    if (name.startsWith('on') && isEmptyEvent(props[name])) {
      delete props[name];
    }
  });
  return props;
}
