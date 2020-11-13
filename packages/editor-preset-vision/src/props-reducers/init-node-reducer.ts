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
    const fieldIds = getCurrentFieldIds();

    // 全局的关闭 uniqueIdChecker 信号，在 ve-utils 中实现
    if (fieldIds.indexOf(props.fieldId) >= 0 && !(window as any).__disable_unique_id_checker__) {
      newProps.fieldId = undefined;
    }
  }
  const initials = node.componentMeta.getMetadata().experimental?.initials;

  if (initials) {
    const getRealValue = (propValue: any) => {
      if (isVariable(propValue)) {
        return propValue.value;
      }
      if (isJSExpression(propValue)) {
        return propValue.mock;
      }
      return propValue;
    };
    initials.forEach(item => {
      // FIXME! this implements SettingTarget
      try {
        // FIXME! item.name could be 'xxx.xxx'
        const ov = newProps[item.name];
        const v = item.initial(node as any, getRealValue(ov));
        if (ov === undefined && v !== undefined) {
          newProps[item.name] = v;
        }
        // 兼容 props 中的属性为 i18n 类型，但是仅提供了一个字符串值，非变量绑定
        if (
          isUseI18NSetter(node.componentMeta.prototype, item.name) &&
          !isI18NObject(ov) &&
          !isJSExpression(ov) &&
          !isJSBlock(ov) &&
          !isJSSlot(ov) &&
          !isVariable(ov) &&
          (isString(v) || isI18NObject(v))
        ) {
          newProps[item.name] = convertToI18NObject(v);
        }
      } catch (e) {
        if (hasOwnProperty(props, item.name)) {
          newProps[item.name] = props[item.name];
        }
      }
      if (newProps[item.name] && !node.props.has(item.name)) {
        node.props.add(newProps[item.name], item.name, false, { skipSetSlot: true });
      }
    });
  }
  return newProps;
}
