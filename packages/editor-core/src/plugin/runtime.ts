import { type LowCodePluginManager } from './manager';
import { type PluginInstance, type PluginMeta } from './plugin';
import { invariant, createLogger, type Logger } from '@alilc/lowcode-shared';

export interface IPluginRuntimeCore {
  name: string;
  dep: string[];
  disabled: boolean;
  instance: PluginInstance;
  logger: Logger;
  meta: PluginMeta;

  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

export interface IPluginRuntimeExportsAccessor {
  [propName: string]: any;
}

export class LowCodePluginRuntime<ContextExtra extends Record<string, any>>
implements IPluginRuntimeCore,IPluginRuntimeExportsAccessor {
  private _inited: boolean;
  /**
   * 标识插件状态，是否被 disabled
   */
  private _disabled: boolean;

  logger: Logger;

  constructor(
    private pluginName: string,
    private manager: LowCodePluginManager<ContextExtra>,
    public instance: PluginInstance,
    public meta: PluginMeta,
  ) {
    this.logger = createLogger({ level: 'warn', bizName: `plugin:${pluginName}` });
  }

  get name() {
    return this.pluginName;
  }

  get dep() {
    if (typeof this.meta.dependencies === 'string') {
      return [this.meta.dependencies];
    }
    // compat legacy way to declare dependencies
    const legacyDepValue = (this.instance as any).dep;
    if (typeof legacyDepValue === 'string') {
      return [legacyDepValue];
    }
    return this.meta.dependencies || legacyDepValue || [];
  }

  get disabled() {
    return this._disabled;
  }

  isInited() {
    return this._inited;
  }

  async init(forceInit?: boolean) {
    if (this._inited && !forceInit) return;
    this.logger.log('method init called');
    await this.instance.init?.call(undefined);
    this._inited = true;
  }

  async destroy() {
    if (!this._inited) return;
    this.logger.log('method destroy called');
    await this.instance?.destroy?.call(undefined);
    this._inited = false;
  }

  setDisabled(flag = true) {
    this._disabled = flag;
  }

  toProxy() {
    invariant(this._inited, 'Could not call toProxy before init');

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
