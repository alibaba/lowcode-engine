import { createLogger, invariant } from '@alilc/lowcode-shared';
import { filterValidOptions, isLowCodeRegisterOptions, sequencify } from './utils';
import { LowCodePluginRuntime } from './runtime';
import { satisfies as semverSatisfies } from 'semver';
import type { PluginCreater, PluginPreferenceValue, PluginPreference } from './plugin';
import { engineConfig } from '../config';
import {
  type LowCodePluginContext,
  type LowCodePluginContextApiAssembler,
  createPluginContext,
  PluginContextOptions
} from './context';

const logger = createLogger({ level: 'warn', bizName: 'designer:pluginManager' });

// 保留的事件前缀
const RESERVED_EVENT_PREFIX = [
  'designer',
  'editor',
  'skeleton',
  'renderer',
  'render',
  'utils',
  'plugin',
  'engine',
  'editor-core',
  'engine-core',
  'plugins',
  'event',
  'events',
  'log',
  'logger',
  'ctx',
  'context',
];

export interface PluginRegisterOptions {
  /**
   * Will enable plugin registered with auto-initialization immediately
   * other than plugin-manager init all plugins at certain time.
   * It is helpful when plugin register is later than plugin-manager initialization.
   */
  autoInit?: boolean;
  /**
   * allow overriding existing plugin with same name when override === true
   */
  override?: boolean;
}

/**
 * plugin manager
 */
export class LowCodePluginManager<ContextExtra extends Record<string, any>> {
  private plugins: LowCodePluginRuntime<ContextExtra>[] = [];

  private pluginsMap: Map<string, LowCodePluginRuntime<ContextExtra>> = new Map();

  private pluginContextMap: Map<string, LowCodePluginContext<ContextExtra>> = new Map();

  private pluginPreference?: PluginPreference = new Map();

  constructor(
    private contextApiAssembler: LowCodePluginContextApiAssembler<
      LowCodePluginContext<ContextExtra>
    >,
    readonly viewName = 'global',
  ) {}

  private _getLowCodePluginContext = (options: PluginContextOptions) => {
    const { pluginName } = options;
    let context = this.pluginContextMap.get(pluginName);
    if (!context) {
      context = createPluginContext(options, this, this.contextApiAssembler);
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
    pluginModel: PluginCreater<LowCodePluginContext<ContextExtra>>,
    options?: any,
    registerOptions?: PluginRegisterOptions,
  ): Promise<void> {
    // registerOptions maybe in the second place
    if (isLowCodeRegisterOptions(options)) {
      registerOptions = options;
      options = {};
    }
    let { pluginName } = pluginModel;
    const { meta = {} } = pluginModel;
    const { preferenceDeclaration, engines } = meta;
    // filter invalid eventPrefix
    const { eventPrefix } = meta;
    const isReservedPrefix = RESERVED_EVENT_PREFIX.find((item) => item === eventPrefix);
    if (isReservedPrefix) {
      meta.eventPrefix = undefined;
      logger.warn(
        `plugin ${pluginName} is trying to use ${eventPrefix} as event prefix, which is a reserved event prefix, please use another one`,
      );
    }

    const ctx = this._getLowCodePluginContext({ pluginName, meta });
    const customFilterValidOptions = engineConfig.get(
      'customPluginFilterOptions',
      filterValidOptions,
    );
    const pluginTransducer = engineConfig.get('customPluginTransducer', null);
    const newPluginModel = pluginTransducer
      ? await pluginTransducer(pluginModel, ctx, options)
      : pluginModel;
    const newOptions = customFilterValidOptions(
      options,
      newPluginModel.meta?.preferenceDeclaration,
    );
    const config = newPluginModel(ctx, newOptions);
    // compat the legacy way to declare pluginName
    pluginName = pluginName || config.name;
    invariant(pluginName, 'pluginConfigCreator.pluginName required', config);

    ctx.setPreference(pluginName, preferenceDeclaration!);

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
          originalPlugin?.instance,
        );
        originalPlugin?.destroy();
        this.pluginsMap.delete(pluginName);
      }
    }

    const engineVersionExp = engines && engines.lowcodeEngine;
    if (engineVersionExp && !this.isEngineVersionMatched(engineVersionExp)) {
      throw new Error(
        `plugin ${pluginName} skipped, engine check failed, current engine version is ${engineConfig.get('ENGINE_VERSION')}, meta.engines.lowcodeEngine is ${engineVersionExp}`,
      );
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

  get(pluginName: string): LowCodePluginRuntime<ContextExtra> | undefined {
    return this.pluginsMap.get(pluginName);
  }

  getAll(): LowCodePluginRuntime<ContextExtra>[] {
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
    const pluginObj: { [name: string]: LowCodePluginRuntime<ContextExtra> } = {};
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

  getPluginPreference(
    pluginName: string,
  ): Record<string, PluginPreferenceValue> | null | undefined {
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
