import { Editor } from '@ali/lowcode-editor-core';
import { ILowCodePlugin, ILowCodePluginConfig, ILowCodePluginManager, ILowCodePluginContext, LowCodeRegisterOptions } from './plugin-types';
import { LowCodePlugin } from './plugin';
import LowCodePluginContext from './plugin-context';
import { getLogger, invariant } from '../utils';
import sequencify from './sequencify';

const logger = getLogger({ level: 'warn', bizName: 'designer:pluginManager' });

export class LowCodePluginManager implements ILowCodePluginManager {
  private plugins: ILowCodePlugin[] = [];

  private pluginsMap: Map<string, ILowCodePlugin> = new Map();

  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  private _getLowCodePluginContext(config: any) {
    return new LowCodePluginContext(this.editor, config);
  }

  // private getNewContext(config: any) {
  //   return new LowCodePluginContext2(this.editor, config);
  // }

  async register(
    pluginConfigCreator: (ctx: ILowCodePluginContext, pluginOptions?: any) => ILowCodePluginConfig,
    pluginOptions?: any,
    options?: LowCodeRegisterOptions,
  ): Promise<void> {
    const ctx = this._getLowCodePluginContext({ name: pluginConfigCreator.pluginName });
    // ctx.newCtx = this.getNewContext();
    const config = pluginConfigCreator(ctx, pluginOptions);
    invariant(config.name, `${config.name} required`, config);
    // ctx.setLogger(config);
    const allowOverride = options?.override === true;
    if (this.pluginsMap.has(config.name)) {
      if (!allowOverride) {
        throw new Error(`Plugin with name ${config.name} exists`);
      } else {
        // clear existing plugin
        const originalPlugin = this.pluginsMap.get(config.name);
        logger.log('plugin override, originalPlugin with name ', config.name, ' will be destroyed, config:', originalPlugin?.config);
        originalPlugin?.destroy();
        this.pluginsMap.delete(config.name);
      }
    }
    const plugin = new LowCodePlugin(this, config, pluginOptions);
    if (options?.autoInit) {
      await plugin.init();
    }
    this.plugins.push(plugin);
    this.pluginsMap.set(plugin.name, plugin);
    logger.log('plugin registered with config:', config, ', options:', pluginOptions);
  }

  get(pluginName: string): ILowCodePlugin | undefined {
    return this.pluginsMap.get(pluginName);
  }

  getAll(): ILowCodePlugin[] {
    return this.plugins;
  }

  has(pluginName: string): boolean {
    return this.pluginsMap.has(pluginName);
  }

  async delete(pluginName: string): Promise<boolean> {
    const idx = this.plugins.findIndex(plugin => plugin.name === pluginName);
    if (idx === -1) return false;
    const plugin = this.plugins[idx];
    await plugin.destroy();

    this.plugins.splice(idx, 1);
    return this.pluginsMap.delete(pluginName);
  }

  async init() {
    const pluginNames: string[] = [];
    const pluginObj: { [name: string]: ILowCodePlugin } = {};
    this.plugins.forEach(plugin => {
      pluginNames.push(plugin.name);
      pluginObj[plugin.name] = plugin;
    });
    const { missingTasks, sequence } = sequencify(pluginObj, pluginNames);
    invariant(!missingTasks.length, 'plugin dependency missing', missingTasks);
    logger.log('load plugin sequence:', sequence);

    for (const pluginName of sequence) {
      try {
        await this.pluginsMap.get(pluginName)!.init();
      } catch (e) {
        logger.error(`Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`);
        logger.error(e);
      }
    }
  }

  async destroy() {
    for (const plugin of this.plugins) {
      await plugin.destroy();
    }
  }

  get size() {
    return this.pluginsMap.size;
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (target.pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (target.pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return target.pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  setDisabled(pluginName: string, flag = true) {
    logger.warn(`plugin:${pluginName} has been set disable:${flag}`);
    this.pluginsMap.get(pluginName)?.setDisabled(flag);
  }

  async dispose() {
    await this.destroy();
    this.plugins = [];
    this.pluginsMap.clear();
  }
}
