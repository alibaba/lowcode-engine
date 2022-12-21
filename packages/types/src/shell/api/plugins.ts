import { IPublicTypePlugin } from '../model';
import { IPublicTypePreferenceValueType } from '../type';

export interface IPluginPreferenceMananger {
  // eslint-disable-next-line max-len
  getPreferenceValue: (
    key: string,
    defaultValue?: IPublicTypePreferenceValueType,
  ) => IPublicTypePreferenceValueType | undefined;
}

export interface ILowCodeRegisterOptions {
  /**
   * Will enable plugin registered with auto-initialization immediately
   * other than plugin-manager init all plugins at certain time.
   * It is helpful when plugin register is later than plugin-manager initialization.
   */
  autoInit?: boolean;
  /**
   * allow overriding existing plugin with same name when override === true
   */
  override?: boolean;
}

export type PluginOptionsType = string | number | boolean | object;

export interface IPublicApiPlugins {
  register(
    pluginModel: IPublicTypePlugin,
    options?: Record<string, PluginOptionsType>,
    registerOptions?: ILowCodeRegisterOptions,
  ): Promise<void>;

  getPluginPreference(
      pluginName: string,
    ): Record<string, IPublicTypePreferenceValueType> | null | undefined;
}