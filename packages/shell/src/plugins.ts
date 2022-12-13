import {
  LowCodePluginManager,
} from '@alilc/lowcode-designer';
import { globalContext } from '@alilc/lowcode-editor-core';
import {
  IPublicApiPlugins,
} from '@alilc/lowcode-types';
import { pluginsSymbol } from './symbols';

const innerPluginsSymbol = Symbol('plugin');
export default class Plugins implements IPublicApiPlugins {
  private readonly [innerPluginsSymbol]: LowCodePluginManager;
  get [pluginsSymbol]() {
    if (this.workspaceMode) {
      return this[innerPluginsSymbol];
    }
    const workSpace = globalContext.get('workSpace');
    if (workSpace.isActive) {
      return workSpace.window.innerPlugins;
    }

    return this[innerPluginsSymbol];
  }

  constructor(plugins: LowCodePluginManager, public workspaceMode: boolean = false) {
    this[innerPluginsSymbol] = plugins;
  }

  async register(
    pluginConfigCreator: (ctx: any, options: any) => any,
    options?: any,
    registerOptions?: any,
  ): Promise<void> {
    await this[pluginsSymbol].register(pluginConfigCreator, options, registerOptions);
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
