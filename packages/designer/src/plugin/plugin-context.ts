/* eslint-disable no-multi-assign */
import { EngineConfig, engineConfig } from '@alilc/lowcode-editor-core';
import { ILowCodePluginManager } from '@alilc/lowcode-designer';
import {
  Hotkey,
  Project,
  Skeleton,
  Setters,
  Material,
  Event,
  Common,
} from '@alilc/lowcode-shell';
import { getLogger, Logger } from '@alilc/lowcode-utils';
import {
  ILowCodePluginContext,
  IPluginContextOptions,
  ILowCodePluginPreferenceDeclaration,
  PreferenceValueType,
  IPluginPreferenceMananger,
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
} from './plugin-types';
import { isValidPreferenceKey } from './plugin-utils';


export default class PluginContext implements ILowCodePluginContext, ILowCodePluginContextPrivate {
  hotkey: Hotkey;
  project: Project;
  skeleton: Skeleton;
  setters: Setters;
  material: Material;
  event: Event;
  config: EngineConfig;
  common: Common;
  logger: Logger;
  plugins: ILowCodePluginManager;
  preference: IPluginPreferenceMananger;

  constructor(
      plugins: ILowCodePluginManager,
      options: IPluginContextOptions,
      contextApiAssembler: ILowCodePluginContextApiAssembler,
    ) {
    this.plugins = plugins;
    const { pluginName = 'anonymous' } = options;
    this.logger = getLogger({ level: 'warn', bizName: `designer:plugin:${pluginName}` });

    const enhancePluginContextHook = engineConfig.get('enhancePluginContextHook');
    if (enhancePluginContextHook) {
      enhancePluginContextHook(this);
    }

    contextApiAssembler.assembleApis(this);
  }

  setPreference(
    pluginName: string,
    preferenceDeclaration: ILowCodePluginPreferenceDeclaration,
  ): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: PreferenceValueType,
      ): PreferenceValueType | undefined => {
      if (!isValidPreferenceKey(key, preferenceDeclaration)) {
        return undefined;
      }
      const pluginPreference = this.plugins.getPluginPreference(pluginName) || {};
      if (pluginPreference[key] === undefined || pluginPreference[key] === null) {
        return defaultValue;
      }
      return pluginPreference[key];
    };

    this.preference = {
      getPreferenceValue,
    };
  }
}
