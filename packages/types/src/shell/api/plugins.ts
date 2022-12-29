import { IPublicModelPluginInstance, IPublicTypePlugin } from '../model';
import { IPublicTypePreferenceValueType } from '../type';
import { IPublicTypePluginRegisterOptions } from '../type/plugin-register-options';

export interface IPluginPreferenceMananger {
  // eslint-disable-next-line max-len
  getPreferenceValue: (
    key: string,
    defaultValue?: IPublicTypePreferenceValueType,
  ) => IPublicTypePreferenceValueType | undefined;
}

export type PluginOptionsType = string | number | boolean | object;

export interface IPublicApiPlugins {
  register(
    pluginModel: IPublicTypePlugin,
    options?: Record<string, PluginOptionsType>,
    registerOptions?: IPublicTypePluginRegisterOptions,
  ): Promise<void>;

  /**
   * @deprecated use options instead
   */
  getPluginPreference(
      pluginName: string,
    ): Record<string, IPublicTypePreferenceValueType> | null | undefined;

  /** 获取指定插件 */
  get(pluginName: string): IPublicModelPluginInstance | null;

  /** 获取所有的插件实例 */
  getAll(): IPublicModelPluginInstance[];

  /** 判断是否有指定插件 */
  has(pluginName: string): boolean;

  /** 删除指定插件 */
  delete(pluginName: string): void;
}