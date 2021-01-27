import {
  isPlainObject,
} from '@ali/lowcode-utils';
import { Node } from '@ali/lowcode-designer';
import { isJSBlock } from '@ali/lowcode-types';
import { isVariable } from '../utils';
import { designerCabin } from '@ali/lowcode-engine';

const { getConvertedExtraKey } = designerCabin;

export function upgradePropsReducer(props: any) {
  if (!props || !isPlainObject(props)) {
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
    newProps[key] = upgradePropsReducer(props[key]);
  });
  return newProps;
}

export function upgradePageLifeCyclesReducer(props: any, node: Node) {
  const lifeCycleNames = ['didMount', 'willUnmount'];
  if (node.isRoot()) {
    lifeCycleNames.forEach(key => {
      if (props[key]) {
        const lifeCycles = node.props.getPropValue(getConvertedExtraKey('lifeCycles')) || {};
        lifeCycles[key] = props[key];
        node.props.setPropValue(getConvertedExtraKey('lifeCycles'), lifeCycles);
      }
    });
  }
  return props;
}
