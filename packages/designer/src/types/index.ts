import { getSetter, registerSetter, getSettersMap } from '@ali/lowcode-editor-core';

export type Setters = {
  getSetter: typeof getSetter;
  registerSetter: typeof registerSetter;
  getSettersMap: typeof getSettersMap;
};
