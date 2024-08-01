import { type StringDictionary, type IDisposable } from '@alilc/lowcode-shared';
import { type IBoosts } from './boosts';
import { ILifeCycleService } from '../life-cycle/lifeCycleService';
import { type ISchemaService } from '../schema';
import { type IPackageManagementService } from '../package';
import { type IStore } from '../../utils/store';

export interface PluginContext<BoostsExtends = object> {
  globalState: IStore<StringDictionary, string>;

  boosts: IBoosts<BoostsExtends>;

  schema: Pick<ISchemaService, 'get' | 'set'>;

  packageManager: IPackageManagementService;

  whenLifeCylePhaseChange: ILifeCycleService['when'];
}

export interface Plugin<BoostsExtends = object> extends IDisposable {
  /**
   * 插件的 name 作为唯一标识，并不可重复。
   */
  name: string;
  /**
   * 插件启动函数
   * @param context 插件能力上下文
   */
  setup(context: PluginContext<BoostsExtends>): void | Promise<void>;
  /**
   * 插件的依赖插件
   */
  dependsOn?: string[];
}
