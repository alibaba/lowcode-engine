import {
  ILowCodePluginManager,
} from '@alilc/lowcode-designer';
import { globalContext } from '@alilc/lowcode-editor-core';
import {
  IPublicApiPlugins,
  IPublicModelPluginInstance,
  IPublicTypePlugin,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
} from '@alilc/lowcode-types';
import { PluginInstance as ShellPluginInstance } from '../model';
import { pluginsSymbol } from '../symbols';

const innerPluginsSymbol = Symbol('plugin');
export class Plugins implements IPublicApiPlugins {
  private readonly [innerPluginsSymbol]: ILowCodePluginManager;
  get [pluginsSymbol](): ILowCodePluginManager {
    if (this.workspaceMode) {
      return this[innerPluginsSymbol];
    }
    const workspace = globalContext.get('workspace');
    if (workspace.isActive) {
      return workspace.window.innerPlugins;
    }

    return this[innerPluginsSymbol];
  }

  constructor(plugins: ILowCodePluginManager, public workspaceMode: boolean = false) {
    this[innerPluginsSymbol] = plugins;
  }

  async register(
    pluginModel: IPublicTypePlugin,
    options?: any,
    registerOptions?: IPublicTypePluginRegisterOptions,
  ): Promise<void> {
    await this[pluginsSymbol].register(pluginModel, options, registerOptions);
  }

  async init(registerOptions: any) {
    await this[pluginsSymbol].init(registerOptions);
  }

  getPluginPreference(
      pluginName: string,
    ): Record<string, IPublicTypePreferenceValueType> | null | undefined {
    return this[pluginsSymbol].getPluginPreference(pluginName);
  }

  get(pluginName: string): IPublicModelPluginInstance | null {
    const instance = this[pluginsSymbol].get(pluginName);
    if (instance) {
      return new ShellPluginInstance(instance);
    }

    return null;
  }

  getAll() {
    return this[pluginsSymbol].getAll()?.map((d) => new ShellPluginInstance(d));
  }

  has(pluginName: string) {
    return this[pluginsSymbol].has(pluginName);
  }

  async delete(pluginName: string) {
    return await this[pluginsSymbol].delete(pluginName);
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        const _target = target[pluginsSymbol];
        if (_target.pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (_target.pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return _target.pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
