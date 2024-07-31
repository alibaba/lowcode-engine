import { invariant, InstantiationService } from '@alilc/lowcode-shared';
import type { AppOptions, RendererApplication } from './types';
import { CodeRuntimeService, ICodeRuntimeService } from './services/code-runtime';
import {
  IExtensionHostService,
  type RenderAdapter,
  type IRenderObject,
  ExtensionHostService,
} from './services/extension';
import { IPackageManagementService, PackageManagementService } from './services/package';
import { ISchemaService, SchemaService } from './services/schema';
import { ILifeCycleService, LifecyclePhase, LifeCycleService } from './services/lifeCycleService';
import { IRuntimeIntlService, RuntimeIntlService } from './services/runtimeIntlService';
import { IRuntimeUtilService, RuntimeUtilService } from './services/runtimeUtilService';

export function createRenderer<RenderObject = IRenderObject>(
  renderAdapter: RenderAdapter<RenderObject>,
): (options: AppOptions) => Promise<RendererApplication<RenderObject>> {
  invariant(typeof renderAdapter === 'function', 'The first parameter must be a function.');

  const instantiationService = new InstantiationService();

  // create services
  const lifeCycleService = new LifeCycleService();
  instantiationService.container.set(ILifeCycleService, lifeCycleService);

  return async (options) => {
    const schemaService = new SchemaService(options.schema);
    instantiationService.container.set(ISchemaService, schemaService);

    const codeRuntimeService = instantiationService.createInstance(
      CodeRuntimeService,
      options.codeRuntime,
    );
    instantiationService.container.set(ICodeRuntimeService, codeRuntimeService);

    const packageManagementService = instantiationService.createInstance(PackageManagementService);
    instantiationService.container.set(IPackageManagementService, packageManagementService);

    const utils = schemaService.get('utils');
    const runtimeUtilService = instantiationService.createInstance(RuntimeUtilService, utils);
    instantiationService.container.set(IRuntimeUtilService, runtimeUtilService);

    const defaultLocale = schemaService.get('config.defaultLocale');
    const i18ns = schemaService.get('i18n', {});
    const runtimeIntlService = instantiationService.createInstance(
      RuntimeIntlService,
      defaultLocale,
      i18ns,
    );
    instantiationService.container.set(IRuntimeIntlService, runtimeIntlService);

    const extensionHostService = new ExtensionHostService(
      lifeCycleService,
      packageManagementService,
      schemaService,
      codeRuntimeService,
      runtimeIntlService,
      runtimeUtilService,
    );
    instantiationService.container.set(IExtensionHostService, extensionHostService);

    lifeCycleService.setPhase(LifecyclePhase.OptionsResolved);

    const renderObject = await renderAdapter(instantiationService);

    await extensionHostService.registerPlugin(options.plugins ?? []);
    // 先加载插件提供 package loader
    await packageManagementService.loadPackages(options.packages ?? []);

    lifeCycleService.setPhase(LifecyclePhase.Ready);

    const app: RendererApplication<RenderObject> = {
      get mode() {
        return __DEV__ ? 'development' : 'production';
      },
      schema: schemaService,
      packageManager: packageManagementService,
      ...renderObject,

      use: (plugin) => {
        return extensionHostService.registerPlugin(plugin);
      },
      destroy: () => {
        lifeCycleService.setPhase(LifecyclePhase.Destroying);
        instantiationService.dispose();
      },
    };

    if (__DEV__) {
      Object.defineProperty(app, '__options', { get: () => options });
    }

    return app;
  };
}
