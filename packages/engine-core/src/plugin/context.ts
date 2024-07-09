import { EventEmitter } from '@alilc/lowcode-shared';
import type { PluginMeta, PluginPreferenceValue, PluginDeclaration } from './types';
import { PluginManager } from './manager';

export interface PluginPreferenceMananger {
  getPreferenceValue: (
    key: string,
    defaultValue?: PluginPreferenceValue,
  ) => PluginPreferenceValue | undefined;
}

export interface PluginContextOptions<ContextExtra extends Record<string, any>> {
  pluginName: string;
  meta?: PluginMeta;
  enhance?: (context: PluginContext<ContextExtra>, pluginName: string, meta: PluginMeta) => void;
}

export class PluginContext<ContextExtra extends Record<string, any>> {
  #pluginManager: PluginManager<ContextExtra>;
  #meta: PluginMeta = {};

  public pluginName: string;

  public pluginEvent: EventEmitter;

  public preference: PluginPreferenceMananger;

  constructor(
    options: PluginContextOptions<ContextExtra>,
    pluginManager: PluginManager<ContextExtra>,
  ) {
    this.pluginName = options.pluginName;
    this.pluginEvent = new EventEmitter(this.pluginName);

    this.#pluginManager = pluginManager;
    if (options.meta) this.#meta = options.meta;

    options.enhance?.(this, this.pluginName, this.#meta);

    /**
     * 管理器初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置
     * use this to get preference config for this plugin when init
     * todo: 这个全局配置是否真的有必要？？？
     */
    this.preference = {
      getPreferenceValue: (key, defaultValue) => {
        if (
          !this.#meta.preferenceDeclaration ||
          !isValidPreferenceKey(key, this.#meta.preferenceDeclaration)
        ) {
          return undefined;
        }
        const globalPluginPreference =
          this.#pluginManager.getPluginPreference(this.pluginName) ?? {};
        if (globalPluginPreference[key] === undefined || globalPluginPreference[key] === null) {
          return defaultValue;
        }
        return globalPluginPreference[key];
      },
    };
  }
}

export function isValidPreferenceKey(
  key: string,
  preferenceDeclaration?: PluginDeclaration,
): boolean {
  if (!preferenceDeclaration || !Array.isArray(preferenceDeclaration.properties)) {
    return false;
  }
  return preferenceDeclaration.properties.some((prop) => {
    return prop.key === key;
  });
}
