import { type IDisposable } from '@alilc/lowcode-shared';
import { type IBoosts } from './boosts';
import { type ISchemaService } from '../schema';
import { type IPackageManagementService } from '../package';

export interface PluginContext<BoostsExtends = object> {
  globalState: Map<string, any>;

  boosts: IBoosts<BoostsExtends>;

  schema: Pick<ISchemaService, 'get' | 'set'>;

  packageManager: IPackageManagementService;
}

export interface Plugin<BoostsExtends = object> {
  /**
   * 插件的 name 作为唯一标识，并不可重复。
   */
  name: string;
  /**
   * 插件启动函数
   * @param context 插件能力上下文
   */
  setup(context: PluginContext<BoostsExtends>): IDisposable | Promise<IDisposable>;
  /**
   * 插件的依赖插件
   */
  dependsOn?: string[];
}
