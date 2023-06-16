/* eslint-disable no-multi-assign */
import { engineConfig, createModuleEventBus } from '@alilc/lowcode-editor-core';
import {
  IPublicApiHotkey,
  IPublicApiProject,
  IPublicApiSkeleton,
  IPublicApiSetters,
  IPublicApiMaterial,
  IPublicApiEvent,
  IPublicApiCommon,
  IPublicModelPluginContext,
  IPluginPreferenceMananger,
  IPublicTypePreferenceValueType,
  IPublicModelEngineConfig,
  IPublicApiLogger,
  IPublicApiPlugins,
  IPublicTypePluginDeclaration,
  IPublicApiCanvas,
  IPublicApiWorkspace,
  IPublicEnumPluginRegisterLevel,
  IPublicModelWindow,
} from '@alilc/lowcode-types';
import {
  IPluginContextOptions,
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
} from './plugin-types';
import { isValidPreferenceKey } from './plugin-utils';

export default class PluginContext implements
  IPublicModelPluginContext, ILowCodePluginContextPrivate {
  hotkey: IPublicApiHotkey;
  project: IPublicApiProject;
  skeleton: IPublicApiSkeleton;
  setters: IPublicApiSetters;
  material: IPublicApiMaterial;
  event: IPublicApiEvent;
  config: IPublicModelEngineConfig;
  common: IPublicApiCommon;
  logger: IPublicApiLogger;
  plugins: IPublicApiPlugins;
  preference: IPluginPreferenceMananger;
  pluginEvent: IPublicApiEvent;
  canvas: IPublicApiCanvas;
  workspace: IPublicApiWorkspace;
  registerLevel: IPublicEnumPluginRegisterLevel;
  editorWindow: IPublicModelWindow;

  constructor(
      options: IPluginContextOptions,
      contextApiAssembler: ILowCodePluginContextApiAssembler,
    ) {
    const { pluginName = 'anonymous', meta = {} } = options;
    contextApiAssembler.assembleApis(this, pluginName, meta);
    this.pluginEvent = createModuleEventBus(pluginName, 200);
    const enhancePluginContextHook = engineConfig.get('enhancePluginContextHook');
    if (enhancePluginContextHook) {
      enhancePluginContextHook(this);
    }
  }

  setPreference(
    pluginName: string,
    preferenceDeclaration: IPublicTypePluginDeclaration,
  ): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: IPublicTypePreferenceValueType,
      ): IPublicTypePreferenceValueType | undefined => {
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
