import { isJSBlock } from '@ali/lowcode-types';
import { isVariable } from './misc';
import { isPlainObject } from './is-plain-object';

export function compatibleLegaoSchema(props: any) {
  if (!props) {
    return props;
  }

  if (Array.isArray(props)) {
    return props.map(k => compatibleLegaoSchema(k));
  }

  if (!isPlainObject(props)) {
    return props;
  }

  if (isJSBlock(props)) {
    if (props.value.componentName === 'Slot') {
      return {
        type: 'JSSlot',
        title: (props.value.props as any)?.slotTitle,
        name: (props.value.props as any)?.slotName,
        value: props.value.children,
      };
    } else {
      return props.value;
    }
  }
  if (isVariable(props)) {
    return {
      type: 'JSExpression',
      value: props.variable,
      mock: props.value,
    };
  }
  const newProps: any = {};
  Object.keys(props).forEach((key) => {
    if (/^__slot__/.test(key) && props[key] === true) {
      return;
    }
    newProps[key] = compatibleLegaoSchema(props[key]);
  });
  return newProps;
}
