import { RegisteredSetter } from '../../editor';
import { CustomView } from '../../setter-config';


export interface IPublicApiSetters {
  /**
   * 获取指定 setter
   * @param type
   * @returns
   */
  getSetter(type: string): RegisteredSetter | null;

  /**
   * 获取已注册的所有 settersMap
   * @returns
   */
  getSettersMap(): Map<string, RegisteredSetter & {
    type: string;
  }>;

  /**
   * 注册一个 setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter(
    typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
    setter?: CustomView | RegisteredSetter | undefined
  ): void;
}
