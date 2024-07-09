import { PluginManager } from './manager';
import { type PluginInstance, type PluginMeta } from './types';
import { invariant, createLogger, type Logger } from '@alilc/lowcode-shared';

export interface PluginRuntimeExportsAccessor {
  [propName: string]: any;
}

export class PluginRuntime<ContextExtra extends Record<string, any>> {
  #inited: boolean;
  /**
   * 标识插件状态，是否被 disabled
   */
  #disabled: boolean;

  #logger: Logger;

  constructor(
    private pluginName: string,
    private manager: PluginManager<ContextExtra>,
    public instance: PluginInstance,
    public meta: PluginMeta,
  ) {
    this.#logger = createLogger({ level: 'warn', bizName: `plugin:${pluginName}` });
  }

  get name() {
    return this.pluginName;
  }

  get dep() {
    if (typeof this.meta.dependencies === 'string') {
      return [this.meta.dependencies];
    }

    return this.meta.dependencies || [];
  }

  get disabled() {
    return this.#disabled;
  }

  isInited() {
    return this.#inited;
  }

  async init(forceInit?: boolean) {
    if (this.#inited && !forceInit) return;
    this.#logger.log('method init called');
    await this.instance.init?.call(undefined);
    this.#inited = true;
  }

  async destroy() {
    if (!this.#inited) return;
    this.#logger.log('method destroy called');
    await this.instance?.destroy?.call(undefined);
    this.#inited = false;
  }

  setDisabled(flag = true) {
    this.#disabled = flag;
  }

  toProxy(): PluginRuntimeExportsAccessor {
    invariant(this.#inited, 'Could not call toProxy before init');

    const exports = this.instance.exports?.();
    return new Proxy(this, {
      get(target, prop, receiver) {
        if ({}.hasOwnProperty.call(exports, prop)) {
          return exports?.[prop as string];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  async dispose() {
    await this.manager.delete(this.name);
  }
}
