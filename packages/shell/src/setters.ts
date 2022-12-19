import { getSetter, registerSetter, getSettersMap } from '@alilc/lowcode-editor-core';
import { CustomView, IPublicApiSetters, RegisteredSetter } from '@alilc/lowcode-types';

export default class Setters implements IPublicApiSetters {
  /**
   * 获取指定 setter
   * @param type
   * @returns
   */
  getSetter(type: string): RegisteredSetter | null {
    return getSetter(type);
  }

  /**
   * 获取已注册的所有 settersMap
   * @returns
   */
  getSettersMap(): Map<string, RegisteredSetter & {
    type: string;
  }> {
    return getSettersMap();
  }

  /**
   * 注册一个 setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter(
    typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
    setter?: CustomView | RegisteredSetter | undefined,
  ) {
    return registerSetter(typeOrMaps, setter);
  }
}
