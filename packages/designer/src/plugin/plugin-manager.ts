import { engineConfig } from '@alilc/lowcode-editor-core';
import { getLogger } from '@alilc/lowcode-utils';
import {
  ILowCodePluginRuntime,
  ILowCodePluginManager,
  IPluginContextOptions,
  PluginPreference,
  ILowCodePluginContextApiAssembler,
} from './plugin-types';
import { filterValidOptions, isLowCodeRegisterOptions } from './plugin-utils';
import { LowCodePluginRuntime } from './plugin';
// eslint-disable-next-line import/no-named-as-default
import LowCodePluginContext from './plugin-context';
import { invariant } from '../utils';
import sequencify from './sequencify';
import semverSatisfies from 'semver/functions/satisfies';
import {
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
  IPublicTypePlugin,
} from '@alilc/lowcode-types';

const logger = getLogger({ level: 'warn', bizName: 'designer:pluginManager' });

// 保留的事件前缀
const RESERVED_EVENT_PREFIX = ['designer', 'editor', 'skeleton', 'renderer', 'render', 'utils', 'plugin', 'engine', 'editor-core', 'engine-core', 'plugins', 'event', 'events', 'log', 'logger', 'ctx', 'context'];

export class LowCodePluginManager implements ILowCodePluginManager {
  private plugins: ILowCodePluginRuntime[] = [];

  pluginsMap: Map<string, ILowCodePluginRuntime> = new Map();
  pluginContextMap: Map<string, LowCodePluginContext> = new Map();

  private pluginPreference?: PluginPreference = new Map();

  contextApiAssembler: ILowCodePluginContextApiAssembler;

  constructor(contextApiAssembler: ILowCodePluginContextApiAssembler, readonly viewName = 'global') {
    this.contextApiAssembler = contextApiAssembler;
  }

  _getLowCodePluginContext = (options: IPluginContextOptions) => {
    const { pluginName } = options;
    let context = this.pluginContextMap.get(pluginName);
    if (!context) {
      context = new LowCodePluginContext(options, this.contextApiAssembler);
      this.pluginContextMap.set(pluginName, context);
    }
    return context;
  };

  isEngineVersionMatched(versionExp: string): boolean {
    const engineVersion = engineConfig.get('ENGINE_VERSION');
    // ref: https://github.com/npm/node-semver#functions
    // 1.0.1-beta should match '^1.0.0'
    return semverSatisfies(engineVersion, versionExp, { includePrerelease: true });
  }

  /**
   * register a plugin
   * @param pluginConfigCreator - a creator function which returns the plugin config
   * @param options - the plugin options
   * @param registerOptions - the plugin register options
   */
  async register(
    pluginModel: IPublicTypePlugin,
    options?: any,
    registerOptions?: IPublicTypePluginRegisterOptions,
  ): Promise<void> {
    // registerOptions maybe in the second place
    if (isLowCodeRegisterOptions(options)) {
      registerOptions = options;
      options = {};
    }
    let { pluginName, meta = {} } = pluginModel;
    const { preferenceDeclaration, engines } = meta;
    // filter invalid eventPrefix
    const { eventPrefix } = meta;
    const isReservedPrefix = RESERVED_EVENT_PREFIX.find((item) => item === eventPrefix);
    if (isReservedPrefix) {
      meta.eventPrefix = undefined;
      logger.warn(`plugin ${pluginName} is trying to use ${eventPrefix} as event prefix, which is a reserved event prefix, please use another one`);
    }
    const ctx = this._getLowCodePluginContext({ pluginName, meta });
    const customFilterValidOptions = engineConfig.get('customPluginFilterOptions', filterValidOptions);
    const pluginTransducer = engineConfig.get('customPluginTransducer', null);
    const newPluginModel = pluginTransducer ? await pluginTransducer(pluginModel, ctx, options) : pluginModel;
    const newOptions = customFilterValidOptions(options, newPluginModel.meta?.preferenceDeclaration);
    const config = newPluginModel(ctx, newOptions);
    // compat the legacy way to declare pluginName
    // @ts-ignore
    pluginName = pluginName || config.name;
    invariant(
      pluginName,
      'pluginConfigCreator.pluginName required',
      config,
    );

    ctx.setPreference(pluginName, preferenceDeclaration);

    const allowOverride = registerOptions?.override === true;

    if (this.pluginsMap.has(pluginName)) {
      if (!allowOverride) {
        throw new Error(`Plugin with name ${pluginName} exists`);
      } else {
        // clear existing plugin
        const originalPlugin = this.pluginsMap.get(pluginName);
        logger.log(
          'plugin override, originalPlugin with name ',
          pluginName,
          ' will be destroyed, config:',
          originalPlugin?.config,
        );
        originalPlugin?.destroy();
        this.pluginsMap.delete(pluginName);
      }
    }

    const engineVersionExp = engines && engines.lowcodeEngine;
    if (engineVersionExp && !this.isEngineVersionMatched(engineVersionExp)) {
      throw new Error(`plugin ${pluginName} skipped, engine check failed, current engine version is ${engineConfig.get('ENGINE_VERSION')}, meta.engines.lowcodeEngine is ${engineVersionExp}`);
    }

    const plugin = new LowCodePluginRuntime(pluginName, this, config, meta);
    // support initialization of those plugins which registered
    // after normal initialization by plugin-manager
    if (registerOptions?.autoInit) {
      await plugin.init();
    }
    this.plugins.push(plugin);
    this.pluginsMap.set(pluginName, plugin);
    logger.log(`plugin registered with pluginName: ${pluginName}, config: `, config, 'meta:', meta);
  }

  get(pluginName: string): ILowCodePluginRuntime | undefined {
    return this.pluginsMap.get(pluginName);
  }

  getAll(): ILowCodePluginRuntime[] {
    return this.plugins;
  }

  has(pluginName: string): boolean {
    return this.pluginsMap.has(pluginName);
  }

  async delete(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.find(({ name }) => name === pluginName);
    if (!plugin) return false;
    await plugin.destroy();
    const idx = this.plugins.indexOf(plugin);
    this.plugins.splice(idx, 1);
    return this.pluginsMap.delete(pluginName);
  }

  async init(pluginPreference?: PluginPreference) {
    const pluginNames: string[] = [];
    const pluginObj: { [name: string]: ILowCodePluginRuntime } = {};
    this.pluginPreference = pluginPreference;
    this.plugins.forEach((plugin) => {
      pluginNames.push(plugin.name);
      pluginObj[plugin.name] = plugin;
    });
    const { missingTasks, sequence } = sequencify(pluginObj, pluginNames);
    invariant(!missingTasks.length, 'plugin dependency missing', missingTasks);
    logger.log('load plugin sequence:', sequence);

    for (const pluginName of sequence) {
      try {
        await this.pluginsMap.get(pluginName)!.init();
      } catch (e) /* istanbul ignore next */ {
        logger.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`,
        );
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

  getPluginPreference(pluginName: string): Record<string, IPublicTypePreferenceValueType> | null | undefined {
    if (!this.pluginPreference) {
      return null;
    }
    return this.pluginPreference.get(pluginName);
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

  /* istanbul ignore next */
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
