import { type Project, type Package } from '@alilc/lowcode-shared';
import { type Plugin } from './services/extension';
import { type ISchemaService } from './services/schema';
import { type IPackageManagementService } from './services/package';
import { type CodeRuntimeOptions } from './services/code-runtime';
import { type ModelDataSourceCreator } from './services/model';

export interface AppOptions {
  schema: Project;
  packages?: Package[];
  plugins?: Plugin[];
  /**
   * code runtime 设置选项
   */
  codeRuntime?: CodeRuntimeOptions;
  /**
   * 数据源创建工厂函数
   */
  dataSourceCreator?: ModelDataSourceCreator;
}

export type RendererApplication<Render = unknown> = {
  readonly mode: 'development' | 'production';

  readonly schema: Omit<ISchemaService, 'initialize'>;

  readonly packageManager: IPackageManagementService;

  use(plugin: Plugin): Promise<void>;

  destroy(): void;
} & Render;
