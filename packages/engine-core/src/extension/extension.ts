import { StringDictionary } from '@alilc/lowcode-shared';
import { IConfigurationNode } from '../configuration';

export type ExtensionInitializer = <Context = any>(ctx: Context) => IExtensionInstance;

/**
 * 函数声明插件
 */
export interface IFunctionExtension extends ExtensionInitializer {
  id: string;
  displayName?: string;
  version: string;
  metadata?: IExtensionMetadata;
}

export interface IExtensionMetadata {
  /**
   * define dependencies which the plugin depends on
   */
  dependencies?: string[];

  /**
   * specify which engine version is compatible with the plugin
   * version rule useage semver version, eg: ^1.0.0;
   */
  engineVerison?: string;

  /**
   * 插件的配置注册信息表
   */
  preferenceConfigurations?: IConfigurationNode[];
}

export interface IExtensionInstance {
  init(): Promise<void> | void;
  destroy(): Promise<void> | void;
  exports?(): StringDictionary | undefined | void;
}
