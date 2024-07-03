import { createLogger, invariant } from '@alilc/lowcode-shared';
import { isPlainObject } from 'lodash-es';
import { sequencify } from './utils';
import { PluginRuntime } from './runtime';
import type { PluginCreater, PluginPreferenceValue, PluginDeclaration } from './types';
import { PluginContext, type PluginContextOptions, isValidPreferenceKey } from './context';

const logger = createLogger({ level: 'warn', bizName: 'pluginManager' });

export type PluginPreference = Map<string, Record<string, PluginPreferenceValue>>;

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
export class PluginManager<ContextExtra extends Record<string, any>> {
  #pluginsMap: Map<string, PluginRuntime<ContextExtra>> = new Map();

  #pluginContextMap: Map<string, PluginContext<ContextExtra>> = new Map();

  #contextEnhancer: PluginContextOptions<ContextExtra>['enhance'] = () => {};

  #pluginPreference: PluginPreference | undefined;

  constructor(contextEnhancer?: PluginContextOptions<ContextExtra>['enhance']) {
    if (contextEnhancer) {
      this.#contextEnhancer = contextEnhancer;
    }
  }

  #getPluginContext = (options: PluginContextOptions<ContextExtra>) => {
    const { pluginName } = options;
    let context = this.#pluginContextMap.get(pluginName);
    if (!context) {
      context = new PluginContext(options, this);
      this.#pluginContextMap.set(pluginName, context);
    }
    return context;
  };

  /**
   * register a plugin
   * @param pluginConfigCreator - a creator function which returns the plugin config
   * @param options - the plugin options
   * @param registerOptions - the plugin register options
   */
  async register(
    pluginCreater: PluginCreater<PluginContext<ContextExtra>>,
    options?: any,
    registerOptions?: PluginRegisterOptions,
  ): Promise<void> {
    // registerOptions maybe in the second place
    if (isPluginRegisterOptions(options)) {
      registerOptions = options;
      options = {};
    }

    const { pluginName, meta = {} } = pluginCreater;
    // const { engines } = meta;
    // filter invalid eventPrefix
    // const isReservedPrefix = RESERVED_EVENT_PREFIX.find((item) => item === eventPrefix);
    // if (isReservedPrefix) {
    //   meta.eventPrefix = undefined;
    //   logger.warn(
    //     `plugin ${pluginName} is trying to use ${eventPrefix} as event prefix, which is a reserved event prefix, please use another one`,
    //   );
    // }

    const ctx = this.#getPluginContext({
      pluginName: pluginCreater.pluginName,
      meta,
      enhance: this.#contextEnhancer,
    });

    // const pluginTransducer = engineConfig.get('customPluginTransducer', null);
    // const newPluginModel = pluginTransducer
    //   ? await pluginTransducer(pluginModel, ctx, options)
    //   : pluginModel;

    // const customFilterValidOptions = engineConfig.get(
    //   'customPluginFilterOptions',
    //   filterValidOptions,
    // );
    const newOptions = filterValidOptions(options, meta.preferenceDeclaration);

    const pluginInstance = pluginCreater(ctx, newOptions);

    invariant(pluginName, 'pluginConfigCreator.pluginName required', pluginInstance);

    const allowOverride = registerOptions?.override === true;

    if (this.#pluginsMap.has(pluginName)) {
      if (!allowOverride) {
        throw new Error(`Plugin with name ${pluginName} exists`);
      } else {
        // clear existing plugin
        const originalPlugin = this.#pluginsMap.get(pluginName);
        logger.log(
          'plugin override, originalPlugin with name ',
          pluginName,
          ' will be destroyed, config:',
          originalPlugin?.instance,
        );
        originalPlugin?.destroy();
        this.#pluginsMap.delete(pluginName);
      }
    }

    const pluginRuntime = new PluginRuntime(pluginName, this, pluginInstance, meta);
    // support initialization of those plugins which registered
    // after normal initialization by plugin-manager
    if (registerOptions?.autoInit) {
      await pluginInstance.init();
    }
    this.#pluginsMap.set(pluginName, pluginRuntime);
    logger.log(
      `plugin registered with pluginName: ${pluginName}, config: `,
      pluginInstance,
      'meta:',
      meta,
    );
  }

  get(pluginName: string): PluginRuntime<ContextExtra> | undefined {
    return this.#pluginsMap.get(pluginName);
  }

  getAll(): PluginRuntime<ContextExtra>[] {
    return [...this.#pluginsMap.values()];
  }

  has(pluginName: string): boolean {
    return this.#pluginsMap.has(pluginName);
  }

  async delete(pluginName: string): Promise<boolean> {
    const plugin = this.#pluginsMap.get(pluginName);
    if (!plugin) return false;
    await plugin.destroy();
    return this.#pluginsMap.delete(pluginName);
  }

  async init(pluginPreference?: PluginPreference) {
    // 管理器初始化时可以提供全局配置给到各插件
    // 是否有必要？
    this.#pluginPreference = pluginPreference;

    const pluginNames: string[] = [];
    const pluginObj: { [name: string]: PluginRuntime<ContextExtra> } = {};

    this.#pluginsMap.forEach((plugin) => {
      pluginNames.push(plugin.name);
      pluginObj[plugin.name] = plugin;
    });

    const { missingTasks, sequence } = sequencify(pluginObj, pluginNames);
    invariant(!missingTasks.length, 'plugin dependency missing', missingTasks);
    logger.log('load plugin sequence:', sequence);

    for (const pluginName of sequence) {
      try {
        await this.#pluginsMap.get(pluginName)!.init();
      } catch (e) /* istanbul ignore next */ {
        logger.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`,
        );
        logger.error(e);
      }
    }
  }

  async destroy() {
    for (const plugin of this.#pluginsMap.values()) {
      await plugin.destroy();
    }
  }

  get size() {
    return this.#pluginsMap.size;
  }

  getPluginPreference(pluginName: string): Record<string, PluginPreferenceValue> | undefined {
    return this.#pluginPreference?.get(pluginName);
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (target.#pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (target.#pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return target.#pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  setDisabled(pluginName: string, flag = true) {
    logger.warn(`plugin:${pluginName} has been set disable:${flag}`);
    this.#pluginsMap.get(pluginName)?.setDisabled(flag);
  }

  async dispose() {
    await this.destroy();
    this.#pluginsMap.clear();
  }
}

function isPluginRegisterOptions(opts: any): opts is PluginRegisterOptions {
  return opts && ('autoInit' in opts || 'override' in opts);
}

function filterValidOptions(opts: any, preferenceDeclaration?: PluginDeclaration) {
  if (!opts || !isPlainObject(opts)) return opts;
  const filteredOpts = {} as any;
  Object.keys(opts).forEach((key) => {
    if (isValidPreferenceKey(key, preferenceDeclaration)) {
      const v = opts[key];
      if (v !== undefined && v !== null) {
        filteredOpts[key] = v;
      }
    }
  });
  return filteredOpts;
}
