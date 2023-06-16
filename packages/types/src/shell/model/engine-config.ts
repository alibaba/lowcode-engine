import { IPublicTypeDisposable } from '../type';
import { IPublicModelPreference } from './';

export interface IPublicModelEngineConfig {

  /**
   * 判断指定 key 是否有值
   * check if config has certain key configed
   * @param key
   * @returns
   */
  has(key: string): boolean;

  /**
   * 获取指定 key 的值
   * get value by key
   * @param key
   * @param defaultValue
   * @returns
   */
  get(key: string, defaultValue?: any): any;

  /**
   * 设置指定 key 的值
   * set value for certain key
   * @param key
   * @param value
   */
  set(key: string, value: any): void;

  /**
   * 批量设值，set 的对象版本
   * set multiple config key-values
   * @param config
   */
  setConfig(config: { [key: string]: any }): void;

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * wait until value of certain key is set, will only be
   * triggered once.
   * @param key
   * @returns
   */
  onceGot(key: string): Promise<any>;

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * set callback for event of value set for some key
   * this will be called each time the value is set
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: string, fn: (data: any) => void): IPublicTypeDisposable;

  /**
   * 获取全局 Preference, 用于管理全局浏览器侧用户 Preference，如 Panel 是否钉住
   * get global user preference manager, which can be use to store
   * user`s preference in user localstorage, such as a panel is pinned or not.
   * @returns {IPublicModelPreference}
   * @since v1.1.0
   */
  getPreference(): IPublicModelPreference;
}
