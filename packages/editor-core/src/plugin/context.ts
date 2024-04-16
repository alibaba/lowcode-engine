import { type IEventBus, createModuleEventBus } from '../event-bus';
import type { PluginMeta, PluginPreferenceValue, PluginDeclaration } from './plugin';
import { type LowCodePluginManager } from './manager';
import { isValidPreferenceKey } from './utils';
import { engineConfig } from '../config';

export interface PluginContextOptions {
  pluginName: string;
  meta?: PluginMeta;
}

export interface LowCodePluginContextApiAssembler<ContextExtra extends Record<string, any>> {
  assembleApis(
    context: LowCodePluginContext<ContextExtra>,
    pluginName: string,
    meta: PluginMeta,
  ): void;
}

export interface PluginPreferenceMananger {
  getPreferenceValue: (
    key: string,
    defaultValue?: PluginPreferenceValue,
  ) => PluginPreferenceValue | undefined;
}

export type LowCodePluginContext<ContextExtra extends Record<string, any>> = {
  pluginEvent: IEventBus;
  preference: PluginPreferenceMananger;
  setPreference(pluginName: string, preferenceDeclaration: PluginDeclaration): void;
} & ContextExtra;

/**
 * create plugin context
 * todo: refactor setPreference
 */
export function createPluginContext<ContextExtra extends Record<string, any>>(
  options: PluginContextOptions,
  manager: LowCodePluginManager<ContextExtra>,
  contextApiAssembler: LowCodePluginContextApiAssembler<LowCodePluginContext<ContextExtra>>
): LowCodePluginContext<ContextExtra> {
  const { pluginName = 'anonymous', meta = {} } = options;
  const pluginEvent = createModuleEventBus(pluginName, 200);

  let _pluginName = pluginName;
  let _preferenceDeclaration: PluginDeclaration;

  const preferenceMananger: PluginPreferenceMananger = {
    getPreferenceValue: (
      key,
      defaultValue?,
    ) => {
      if (!isValidPreferenceKey(key, _preferenceDeclaration)) {
        return undefined;
      }
      const pluginPreference = manager.getPluginPreference(_pluginName) || {};
      if (pluginPreference[key] === undefined || pluginPreference[key] === null) {
        return defaultValue;
      }
      return pluginPreference[key];
    }
  };

  const contextBase = {
    pluginEvent,
    preference: preferenceMananger,
    setPreference(
      pluginName: string,
      preferenceDeclaration: PluginDeclaration,
    ): void {
      _pluginName = pluginName;
      _preferenceDeclaration = preferenceDeclaration;
    }
  } as LowCodePluginContext<ContextExtra>;

  contextApiAssembler.assembleApis(contextBase, pluginName, meta);
  const enhancePluginContextHook = engineConfig.get('enhancePluginContextHook');
  if (enhancePluginContextHook) {
    enhancePluginContextHook(contextBase);
  }

  return contextBase;
}
