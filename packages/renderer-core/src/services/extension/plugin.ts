import { type EventEmitter, type IStore, type PlainObject } from '@alilc/lowcode-shared';
import { type IBoosts } from './boosts';
import { LifecyclePhase } from '../lifeCycleService';
import { type ISchemaService } from '../schema';
import { type IPackageManagementService } from '../package';

export interface PluginContext<BoostsExtends = object> {
  eventEmitter: EventEmitter;
  globalState: IStore<PlainObject, string>;
  boosts: IBoosts<BoostsExtends>;
  schema: ISchemaService;
  packageManager: IPackageManagementService;
  /**
   * 生命周期变更事件
   */
  whenLifeCylePhaseChange(phase: LifecyclePhase): Promise<void>;
}

export interface Plugin<BoostsExtends = object> {
  /**
   * 插件的 name 作为唯一标识，并不可重复。
   */
  name: string;
  setup(context: PluginContext<BoostsExtends>): void | Promise<void>;
  destory?(): void | Promise<void>;
  dependsOn?: string[];
}
