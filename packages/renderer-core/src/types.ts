import { type Spec } from '@alilc/lowcode-shared';
import { type Plugin } from './services/extension';
import { type ISchemaService } from './services/schema';
import { type IPackageManagementService } from './services/package';
import { type CodeRuntimeInitializeOptions } from './services/code-runtime';

export interface AppOptions {
  schema: Spec.Project;
  packages?: Spec.Package[];
  plugins?: Plugin[];

  /**
   * 运行模式
   */
  mode?: 'development' | 'production';

  /**
   * code runtime 设置选项
   */
  codeRuntime?: CodeRuntimeInitializeOptions;
}

export type RendererApplication<Render = unknown> = {
  readonly mode: 'development' | 'production';

  readonly schema: Omit<ISchemaService, 'initialize'>;

  readonly packageManager: IPackageManagementService;

  use(plugin: Plugin): Promise<void>;
} & Render;
