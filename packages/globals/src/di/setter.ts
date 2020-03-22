import { ReactNode } from 'react';
import { CustomView, isCustomView } from '../types/setter-config';
import { createContent } from '../../../utils/create-content';
import { TitleContent } from '../types';

export type RegisteredSetter = {
  component: CustomView;
  defaultProps?: object;
  title?: TitleContent;
};

const settersMap = new Map<string, RegisteredSetter>();
export function registerSetter(type: string, setter: CustomView | RegisteredSetter) {
  if (isCustomView(setter)) {
    setter = {
      component: setter,
      title: (setter as any).displayName || (setter as any).name || 'CustomSetter'
    };
  }
  settersMap.set(type, setter);
}

export function getSetter(type: string): RegisteredSetter | null {
  return settersMap.get(type) || null;
}

export function createSetterContent(setter: any, props: object): ReactNode {
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

  return createContent(setter, props);
}
