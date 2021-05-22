import {
  isPlainObject,
} from '@ali/lowcode-utils';
import { isJSExpression, isJSSlot } from '@ali/lowcode-types';
import { Node } from '@ali/lowcode-designer';

export function compatibleReducer(props: any, node: Node): any {
  // 如果不是 vc 体系，不做这个兼容处理
  if (!node.componentMeta.prototype) {
    return props;
  }
  if (!props || !isPlainObject(props)) {
    return props;
  }
  // 为了能降级到老版本，建议在后期版本去掉以下代码
  if (isJSSlot(props)) {
    return {
      type: 'JSBlock',
      value: {
        componentName: 'Slot',
        children: props.value,
        props: {
          slotTitle: props.title,
          slotName: props.name,
        },
      },
      __params__: props.params,
    };
  }
  if (isJSExpression(props) && !props.events) {
    return {
      type: 'variable',
      value: props.mock,
      variable: props.value,
    };
  }
  const newProps: any = {};
  Object.entries<any>(props).forEach(([key, val]) => {
    // // TODO: 目前 dataSource 面板里既用到了 JSExpression，又用到了 variable，这里先都不处理，后面再重构
    // if (key === 'dataSource') {
    //   newProps[key] = props[key];
    //   return;
    // }
    newProps[key] = compatibleReducer(val, node);
  });
  return newProps;
}
