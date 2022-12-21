import { IPublicTypeCustomView, IPublicApiSetters, IPublicTypeRegisteredSetter } from '@alilc/lowcode-types';
import { Setters as InnerSetters, globalContext } from '@alilc/lowcode-editor-core';
import { ReactNode } from 'react';

const innerSettersSymbol = Symbol('setters');
const settersSymbol = Symbol('setters');

export class Setters implements IPublicApiSetters {
  readonly [innerSettersSymbol]: InnerSetters;

  get [settersSymbol](): InnerSetters {
    if (this.workspaceMode) {
      return this[innerSettersSymbol];
    }

    const workspace = globalContext.get('workspace');
    if (workspace.isActive) {
      return workspace.window.innerSetters;
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
  getSettersMap(): Map<string, IPublicTypeRegisteredSetter & {
    type: string;
  }> {
    return this[settersSymbol].getSettersMap();
  }

  /**
   * 注册一个 setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter = (
    typeOrMaps: string | { [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter },
    setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter | undefined,
  ) => {
    return this[settersSymbol].registerSetter(typeOrMaps, setter);
  };

  createSetterContent = (setter: any, props: Record<string, any>): ReactNode => {
    return this[settersSymbol].createSetterContent(setter, props);
  };
}
