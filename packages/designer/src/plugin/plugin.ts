import { getLogger, Logger } from '@alilc/lowcode-utils';
import {
  ILowCodePluginRuntime,
  ILowCodePluginManager,
} from './plugin-types';
import {
  IPublicTypePluginConfig,
  IPublicTypePluginMeta,
} from '@alilc/lowcode-types';
import { invariant } from '../utils';

export class LowCodePluginRuntime implements ILowCodePluginRuntime {
  config: IPublicTypePluginConfig;

  logger: Logger;

  private manager: ILowCodePluginManager;

  private _inited: boolean;

  private pluginName: string;

  meta: IPublicTypePluginMeta;

  /**
   * 标识插件状态，是否被 disabled
   */
  private _disabled: boolean;

  constructor(
    pluginName: string,
    manager: ILowCodePluginManager,
    config: IPublicTypePluginConfig,
    meta: IPublicTypePluginMeta,
  ) {
    this.manager = manager;
    this.config = config;
    this.pluginName = pluginName;
    this.meta = meta;
    this.logger = getLogger({ level: 'warn', bizName: `plugin:${pluginName}` });
  }

  get name() {
    return this.pluginName;
  }

  get dep() {
    if (typeof this.meta.dependencies === 'string') {
      return [this.meta.dependencies];
    }
    // compat legacy way to declare dependencies
    const legacyDepValue = (this.config as any).dep;
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
    await this.config.init?.call(undefined);
    this._inited = true;
  }

  async destroy() {
    if (!this._inited) return;
    this.logger.log('method destroy called');
    await this.config?.destroy?.call(undefined);
    this._inited = false;
  }

  setDisabled(flag = true) {
    this._disabled = flag;
  }

  toProxy() {
    invariant(this._inited, 'Could not call toProxy before init');
    const exports = this.config.exports?.();
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
