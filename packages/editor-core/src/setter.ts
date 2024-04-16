import { IPublicModelSettingField, IPublicTypeCustomView, IPublicTypeRegisteredSetter } from '@alilc/lowcode-types';
import { isCustomView } from '@alilc/lowcode-utils';

export class Setters {
  settersMap = new Map<string, IPublicTypeRegisteredSetter & {
    type: string;
  }>();

  constructor(readonly viewName: string = 'global') {}

  /**
   * 获取指定 setter
   * get setter by type
   * @param type
   * @returns
   */
  getSetter = (type: string): IPublicTypeRegisteredSetter | null => {
    return this.settersMap.get(type) || null;
  };

  /**
   * 获取已注册的所有 settersMap
   * get map of all registered setters
   * @returns
   */
  getSettersMap = () => {
    return this.settersMap;
  };

  /**
   * 注册一个 setter
   * register a setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter = (
    typeOrMaps: string | { [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter },
    setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter,
  ) => {
    if (typeof typeOrMaps === 'object') {
      Object.keys(typeOrMaps).forEach(type => {
        this.registerSetter(type, typeOrMaps[type]);
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
        setter.initialValue = (field: IPublicModelSettingField) => {
          return initial.call(field, field.getValue());
        };
      }
    }
    this.settersMap.set(typeOrMaps, { type: typeOrMaps, ...setter });
  };
}

function getInitialFromSetter(setter: any) {
  return setter && (
    setter.initial || setter.Initial
    || (setter.type && (setter.type.initial || setter.type.Initial))
  ) || null;
}
