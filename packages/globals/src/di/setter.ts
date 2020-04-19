import { ReactNode } from 'react';
import { CustomView, isCustomView } from '../types/setter-config';
import { createContent } from '../utils/create-content';
import { TitleContent } from '../types';

export type RegisteredSetter = {
  component: CustomView;
  defaultProps?: object;
  title?: TitleContent;
  /**
   * for MixedSetter to check this setter if available
   */
  condition?: (field: any) => boolean;
  /**
   * for MixedSetter to manual change to this setter
   */
  initialValue?: any | ((field: any) => any);
};
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
  settersMap.set(typeOrMaps, { type: typeOrMaps, ...setter });
}

export function getSetter(type: string): RegisteredSetter | null {
  return settersMap.get(type) || null;
}
export function getSettersMap() {
  return settersMap;
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
