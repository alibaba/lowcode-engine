import { type Spec } from '@alilc/lowcode-shared';
import { type Plugin } from './parts/extension';
import { type ISchemaService } from './parts/schema';
import { type IPackageManagementService } from './parts/package';
import { type IExtensionHostService } from './parts/extension';
import { type EvalCodeFunction } from './parts/code-runtime';

export interface AppOptions {
  schema: Spec.Project;
  packages?: Spec.Package[];
  plugins?: Plugin[];

  /**
   * 应用语言，默认值为浏览器当前语言 navigator.language
   */
  locale?: string;

  /**
   * 运行模式
   */
  mode?: 'development' | 'production';

  evalCodeFunction?: EvalCodeFunction;
}

export type RendererApplication<Render = unknown> = {
  readonly mode: 'development' | 'production';

  readonly schema: Omit<ISchemaService, 'initialize'>;

  readonly packageManager: IPackageManagementService;

  use: IExtensionHostService['registerPlugin'];
} & Render;
