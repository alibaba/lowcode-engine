/* eslint-disable no-multi-assign */
import { engineConfig } from '@alilc/lowcode-editor-core';
import {
  IPublicApiHotkey,
  IPublicApiProject,
  IPublicApiSkeleton,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiCommon,
  ILowCodePluginContext,
  IPluginPreferenceMananger,
  PreferenceValueType,
  IEngineConfig,
  IPublicApiLogger,
  IPublicApiPlugins,
} from '@alilc/lowcode-types';
import {
  IPluginContextOptions,
  ILowCodePluginPreferenceDeclaration,
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
} from './plugin-types';
import { isValidPreferenceKey } from './plugin-utils';


export default class PluginContext implements ILowCodePluginContext, ILowCodePluginContextPrivate {
  hotkey: IPublicApiHotkey;
  project: IPublicApiProject;
  skeleton: IPublicApiSkeleton;
  setters: IPublicApiSetters;
  material: IPublicApiMaterial;
  event: IPublicApiEvent;
  config: IEngineConfig;
  common: IPublicApiCommon;
  logger: IPublicApiLogger;
  plugins: IPublicApiPlugins;
  preference: IPluginPreferenceMananger;

  constructor(
      options: IPluginContextOptions,
      contextApiAssembler: ILowCodePluginContextApiAssembler,
    ) {
    const { pluginName = 'anonymous' } = options;
    contextApiAssembler.assembleApis(this, pluginName);

    const enhancePluginContextHook = engineConfig.get('enhancePluginContextHook');
    if (enhancePluginContextHook) {
      enhancePluginContextHook(this);
    }
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
