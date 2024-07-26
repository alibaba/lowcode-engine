import { invariant, InstantiationService } from '@alilc/lowcode-shared';
import { ICodeRuntimeService } from './services/code-runtime';
import {
  IExtensionHostService,
  type RenderAdapter,
  type IRenderObject,
} from './services/extension';
import { IPackageManagementService } from './services/package';
import { ISchemaService } from './services/schema';
import { ILifeCycleService, LifecyclePhase } from './services/lifeCycleService';
import type { AppOptions, RendererApplication } from './types';

/**
 * 创建 createRenderer 的辅助函数
 * @param schema
 * @param options
 * @returns
 */
export function createRenderer<RenderObject = IRenderObject>(
  renderAdapter: RenderAdapter<RenderObject>,
): (options: AppOptions) => Promise<RendererApplication<RenderObject>> {
  invariant(typeof renderAdapter === 'function', 'The first parameter must be a function.');

  const accessor = new InstantiationService({ defaultScope: 'Singleton' });
  let mode: 'development' | 'production' = 'production';

  const schemaService = accessor.get(ISchemaService);
  const packageManagementService = accessor.get(IPackageManagementService);
  const codeRuntimeService = accessor.get(ICodeRuntimeService);
  const lifeCycleService = accessor.get(ILifeCycleService);
  const extensionHostService = accessor.get(IExtensionHostService);

  return async (options) => {
    if (options.mode) mode = options.mode;

    // valid schema
    schemaService.initialize(options.schema);
    codeRuntimeService.initialize(options.codeRuntime ?? {});
    await lifeCycleService.setPhase(LifecyclePhase.OptionsResolved);

    const renderObject = await renderAdapter(accessor);

    await extensionHostService.registerPlugin(options.plugins ?? []);
    // 先加载插件提供 package loader
    await packageManagementService.loadPackages(options.packages ?? []);

    await lifeCycleService.setPhase(LifecyclePhase.Ready);

    const app: RendererApplication<RenderObject> = {
      get mode() {
        return mode;
      },
      schema: schemaService,
      packageManager: packageManagementService,
      ...renderObject,

      use: (plugin) => {
        return extensionHostService.registerPlugin(plugin);
      },
      destroy: async () => {
        return lifeCycleService.setPhase(LifecyclePhase.Destroying);
      },
    };

    if (mode === 'development') {
      Object.defineProperty(app, '__options', { get: () => options });
    }

    return app;
  };
}
