import {
  hasOwnProperty,
  isI18NObject,
  isUseI18NSetter,
  convertToI18NObject,
  isString,
} from '@ali/lowcode-utils';
import { isJSExpression, isJSBlock, isJSSlot } from '@ali/lowcode-types';
import { isVariable, getCurrentFieldIds } from '../utils';

export function initNodeReducer(props, node) {
  // run initials
  const newProps: any = {
    ...props,
  };
  if (newProps.fieldId) {
    const { doc, fieldIds } = getCurrentFieldIds();

    // 全局的关闭 uniqueIdChecker 信号，在 ve-utils 中实现
    if (doc === node.document && fieldIds.indexOf(props.fieldId) >= 0 && !(window as any).__disable_unique_id_checker__) {
      newProps.fieldId = undefined;
    }
  }
  const initials = node.componentMeta.getMetadata().experimental?.initials;

  if (initials) {
    initials.forEach(item => {
      try {
        // FIXME! item.name could be 'xxx.xxx'
        const value = newProps[item.name];
        // 几种不再进行 initial 计算的情况
        // 1. name === 'fieldId' 并且已经有值
        // 2. 结构为 JSExpression 并且带有 events 字段
        if ((item.name === 'fieldId' && value) || (isJSExpression(value) && value.events)) {
          if (newProps[item.name] && !node.props.has(item.name)) {
            node.props.add(value, item.name, false);
          }
          return;
        }
        newProps[item.name] = item.initial(node as any, newProps[item.name]);
        if (newProps[item.name] && !node.props.has(item.name)) {
          node.props.add(value, item.name, false);
        }
      } catch (e) {
        if (hasOwnProperty(props, item.name)) {
          newProps[item.name] = props[item.name];
        }
      }
    });
  }
  return newProps;
}
