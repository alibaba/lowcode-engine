import {
  ILowCodePlugin,
  ILowCodePluginConfig,
  ILowCodePluginManager,
  CompositeObject,
} from '@ali/lowcode-types';
import { EventEmitter } from 'events';
import { getLogger, Logger, invariant } from '../utils';

export class LowCodePlugin implements ILowCodePlugin {
  config: ILowCodePluginConfig;

  logger: Logger;

  private manager: ILowCodePluginManager;

  private options?: CompositeObject;

  private emiter: EventEmitter;

  private _inited: boolean;

  /**
   * 标识插件状态，是否被 disabled
   */
  private _disabled: boolean;

  constructor(
    manager: ILowCodePluginManager,
    config: ILowCodePluginConfig = {},
    options: CompositeObject = {},
  ) {
    this.manager = manager;
    this.config = config;
    this.options = options;
    this.emiter = new EventEmitter();
    this.logger = getLogger({ level: 'log', bizName: `designer:plugin:${config.name}` });
  }

  get name() {
    return this.config.name;
  }

  get dep() {
    return this.config.dep || [];
  }

  get disabled() {
    return this._disabled;
  }

  on(...args) {
    return this.emiter.on(...args);
  }

  emit(...args) {
    return this.emiter.emit(...args);
  }

  async init() {
    this.logger.log('method init called');
    await this.config.init?.call();
    this._inited = true;
  }

  async destroy() {
    this.logger.log('method destroy called');
    await this.config.destroy?.call();
  }

  private setDisabled(flag = true) {
    this._disabled = flag;
  }

  toProxy() {
    invariant(this._inited, 'Could not call toProxy before init');
    const exports = this.config.exports?.();
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (hasOwnProperty.call(exports, prop)) {
          return exports[prop];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  dispose() {
    return this.manager.delete(this.name);
  }
}
