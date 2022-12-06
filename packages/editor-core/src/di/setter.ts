import { ReactNode } from 'react';
import { CustomView, RegisteredSetter } from '@alilc/lowcode-types';
import { createContent, isCustomView } from '@alilc/lowcode-utils';


const settersMap = new Map<string, RegisteredSetter & {
  type: string;
}>();
export function registerSetter(
  typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
  setter?: CustomView | RegisteredSetter,
) {
  if (typeof typeOrMaps === 'object') {
    Object.keys(typeOrMaps).forEach(type => {
      registerSetter(type, typeOrMaps[type]);
    });
    return;
  }
  if (!setter) {
    return;
  }
  if (isCustomView(setter)) {
    setter = {
      component: setter,
      // todo: intl
      title: (setter as any).displayName || (setter as any).name || 'CustomSetter',
    };
  }
  if (!setter.initialValue) {
    const initial = getInitialFromSetter(setter.component);
    if (initial) {
      setter.initialValue = (field: any) => {
        return initial.call(field, field.getValue());
      };
    }
  }
  settersMap.set(typeOrMaps, { type: typeOrMaps, ...setter });
}

function getInitialFromSetter(setter: any) {
  return setter && (
    setter.initial || setter.Initial
      || (setter.type && (setter.type.initial || setter.type.Initial))
    ) || null; // eslint-disable-line
}

export function getSetter(type: string): RegisteredSetter | null {
  return settersMap.get(type) || null;
}
export function getSettersMap() {
  return settersMap;
}

export function createSetterContent(setter: any, props: Record<string, any>): ReactNode {
  if (typeof setter === 'string') {
    setter = getSetter(setter);
    if (!setter) {
      return null;
    }
    if (setter.defaultProps) {
      props = {
        ...setter.defaultProps,
        ...props,
      };
    }
    setter = setter.component;
  }

  // Fusion的表单组件都是通过 'value' in props 来判断是否使用 defaultValue
  if ('value' in props && typeof props.value === 'undefined') {
    delete props.value;
  }

  return createContent(setter, props);
}
