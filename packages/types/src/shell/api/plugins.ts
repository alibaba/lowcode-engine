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
   * 引擎初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置
   * use this to get preference config for this plugin when engine.init() called
   */
  getPluginPreference(
      pluginName: string,
    ): Record<string, IPublicTypePreferenceValueType> | null | undefined;

  /**
   * 获取指定插件
   * get plugin instance by name
   */
  get(pluginName: string): IPublicModelPluginInstance | null;

  /**
   * 获取所有的插件实例
   * get all plugin instances
   */
  getAll(): IPublicModelPluginInstance[];

  /**
   * 判断是否有指定插件
   * check if plugin with certain name exists
   */
  has(pluginName: string): boolean;

  /**
   * 删除指定插件
   * delete plugin instance by name
   */
  delete(pluginName: string): void;
}
