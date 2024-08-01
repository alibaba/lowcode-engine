import {
  invariant,
  InstantiationService,
  BeanContainer,
  CtorDescriptor,
  type Project,
  type Package,
} from '@alilc/lowcode-shared';
import { CodeRuntimeService, ICodeRuntimeService, type CodeRuntimeOptions } from './code-runtime';
import {
  IExtensionHostService,
  type RenderAdapter,
  type IRenderObject,
  ExtensionHostService,
  type Plugin,
} from './extension';
import { IPackageManagementService, PackageManagementService } from './package';
import { ISchemaService, SchemaService } from './schema';
import { ILifeCycleService, LifecyclePhase, LifeCycleService } from './life-cycle';
import { IRuntimeIntlService, RuntimeIntlService } from './intl';
import { IRuntimeUtilService, RuntimeUtilService } from './util';
import { type ModelDataSourceCreator } from './model';

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

export function createRenderer<RenderObject = IRenderObject>(
  renderAdapter: RenderAdapter<RenderObject>,
): (options: AppOptions) => Promise<RendererApplication<RenderObject>> {
  invariant(typeof renderAdapter === 'function', 'The first parameter must be a function.');

  return async (options) => {
    // create services
    const container = new BeanContainer();
    const lifeCycleService = new LifeCycleService();
    container.set(ILifeCycleService, lifeCycleService);

    const schemaService = new SchemaService(options.schema);
    container.set(ISchemaService, schemaService);

    container.set(
      ICodeRuntimeService,
      new CtorDescriptor(CodeRuntimeService, [options.codeRuntime]),
    );
    container.set(IPackageManagementService, new CtorDescriptor(PackageManagementService));

    const utils = schemaService.get('utils');
    container.set(IRuntimeUtilService, new CtorDescriptor(RuntimeUtilService, [utils]));

    const defaultLocale = schemaService.get('config.defaultLocale');
    const i18ns = schemaService.get('i18n', {});
    container.set(
      IRuntimeIntlService,
      new CtorDescriptor(RuntimeIntlService, [defaultLocale, i18ns]),
    );

    container.set(IExtensionHostService, new CtorDescriptor(ExtensionHostService));

    const instantiationService = new InstantiationService(container);

    lifeCycleService.setPhase(LifecyclePhase.OptionsResolved);

    const [extensionHostService, packageManagementService] = instantiationService.invokeFunction(
      (accessor) => {
        return [accessor.get(IExtensionHostService), accessor.get(IPackageManagementService)];
      },
    );

    const renderObject = await renderAdapter(instantiationService);

    await extensionHostService.registerPlugin(options.plugins ?? []);

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
