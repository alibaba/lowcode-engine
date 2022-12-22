import { IPreference } from '../../engine-config';


export interface IPublicModelEngineConfig {
  /**
   * 判断指定 key 是否有值
   * @param key
   * @returns
   */
  has(key: string): boolean;

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   * @returns
   */
  get(key: string, defaultValue?: any): any;

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any): void;

  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: { [key: string]: any }): void;

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: string): Promise<any>;

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: string, fn: (data: any) => void): () => void;

  /**
   * 获取全局 Preference, 用于管理全局浏览器侧用户 Preference，如 Panel 是否钉住
   * @returns IPreference
   */
  getPreference(): IPreference;
}
