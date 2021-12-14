import { getSetter, registerSetter, getSettersMap, RegisteredSetter } from '@ali/lowcode-editor-core';
import { CustomView } from '@ali/lowcode-types';

export default class Setters {
  getSetter(type: string) {
    return getSetter(type);
  }

  getSettersMap() {
    return getSettersMap();
  }

  registerSetter(
    typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
    setter?: CustomView | RegisteredSetter | undefined,
  ) {
    return registerSetter(typeOrMaps, setter);
  }
}
