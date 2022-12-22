import { IPublicTypeRegisteredSetter, IPublicTypeCustomView } from '../type';

export interface IPublicApiSetters {
  /**
   * 获取指定 setter
   * @param type
   * @returns
   */
  getSetter(type: string): IPublicTypeRegisteredSetter | null;

  /**
   * 获取已注册的所有 settersMap
   * @returns
   */
  getSettersMap(): Map<string, IPublicTypeRegisteredSetter & {
    type: string;
  }>;

  /**
   * 注册一个 setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter(
    typeOrMaps: string | { [key: string]: IPublicTypeCustomView | IPublicTypeRegisteredSetter },
    setter?: IPublicTypeCustomView | IPublicTypeRegisteredSetter | undefined
  ): void;
}
