import { Setters as InnerSetters, RegisteredSetter, globalContext } from '@alilc/lowcode-editor-core';
import { CustomView } from '@alilc/lowcode-types';
import { ReactNode } from 'react';

const innerSettersSymbol = Symbol('setters');
const settersSymbol = Symbol('setters');

export default class Setters {
  readonly [innerSettersSymbol]: InnerSetters;

  get [settersSymbol](): InnerSetters {
    if (this.workspaceMode) {
      return this[innerSettersSymbol];
    }

    const workSpace = globalContext.get('workSpace');
    if (workSpace.isActive) {
      return workSpace.window.innerSetters;
    }

    return this[innerSettersSymbol];
  }

  constructor(innerSetters: InnerSetters, readonly workspaceMode = false) {
    this[innerSettersSymbol] = innerSetters;
  }

  /**
   * 获取指定 setter
   * @param type
   * @returns
   */
  getSetter = (type: string) => {
    return this[settersSymbol].getSetter(type);
  };

  /**
   * 获取已注册的所有 settersMap
   * @returns
   */
  getSettersMap = () => {
    return this[settersSymbol].getSettersMap();
  };

  /**
   * 注册一个 setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter = (
    typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
    setter?: CustomView | RegisteredSetter | undefined,
  ) => {
    return this[settersSymbol].registerSetter(typeOrMaps, setter);
  };

  createSetterContent = (setter: any, props: Record<string, any>): ReactNode => {
    return this[settersSymbol].createSetterContent(setter, props);
  };
}
