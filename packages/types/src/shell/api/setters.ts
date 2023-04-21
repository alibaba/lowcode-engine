import { ReactNode } from 'react';

import { IPublicTypeRegisteredSetter, IPublicTypeCustomView } from '../type';

export interface IPublicApiSetters {

  /**
   * 获取指定 setter
   * get setter by type
   * @param type
   * @returns
   */
  getSetter(type: string): IPublicTypeRegisteredSetter | null;

  /**
   * 获取已注册的所有 settersMap
   * get map of all registered setters
   * @returns
   */
  getSettersMap(): Map<string, IPublicTypeRegisteredSetter & {
    type: string;
  }>;

  /**
   * 注册一个 setter
   * register a setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter(
    typeOrMaps: string | { [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter },
    setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter | undefined
  ): void;

  /**
   * @deprecated
   */
  createSetterContent (setter: any, props: Record<string, any>): ReactNode;
}
