import { EventEmitter, KeyValueStore } from '@alilc/lowcode-shared';
import { type RendererApplication } from '../../types';
import { IBoosts } from './boosts';

export interface PluginContext<BoostsExtends = object> {
  eventEmitter: EventEmitter;
  globalState: KeyValueStore;

  boosts: IBoosts<BoostsExtends>;
}

export interface Plugin<BoostsExtends = object> {
  /**
   * 插件的 name 作为唯一标识，并不可重复。
   */
  name: string;
  setup(app: RendererApplication, context: PluginContext<BoostsExtends>): void | Promise<void>;
  destory?(): void | Promise<void>;
  dependsOn?: string[];
}
