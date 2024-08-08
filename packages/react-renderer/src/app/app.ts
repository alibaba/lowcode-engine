import {
  InstantiationService,
  BeanContainer,
  CtorDescriptor,
  Disposable,
} from '@alilc/lowcode-shared';
import {
  CodeRuntimeService,
  ICodeRuntimeService,
  IExtensionHostService,
  ExtensionHostService,
  IPackageManagementService,
  PackageManagementService,
  ISchemaService,
  SchemaService,
  IRuntimeIntlService,
  RuntimeIntlService,
  IRuntimeUtilService,
  RuntimeUtilService,
} from '@alilc/lowcode-renderer-core';
import { createRouter, type RouterOptions, type Router } from '@alilc/lowcode-renderer-router';
import { type ComponentType, createElement } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import {
  IReactRendererBoostsService,
  ReactRendererBoostsService,
  type ReactRendererBoostsApi,
} from './boosts';
import { createAppView } from './components/view';
import { type ComponentOptions } from '../runtime/createComponent';

import type { Project, Package } from '@alilc/lowcode-shared';
import type {
  Plugin,
  CodeRuntimeOptions,
  ModelDataSourceCreator,
  ModelStateCreator,
  ICodeRuntime,
} from '@alilc/lowcode-renderer-core';

export type ComponentsAccessor = Pick<IPackageManagementService, 'getComponent'>;

export type SchemaAccessor = Pick<ISchemaService, 'get'>;

export interface IRendererApplication {
  readonly options: AppOptions;

  readonly mode: 'development' | 'production';

  mount: (containerOrId?: string | HTMLElement) => void | Promise<void>;

  unmount: () => void | Promise<void>;

  use(plugin: Plugin<ReactRendererBoostsApi>): Promise<void>;

  destroy(): void;
}

export interface AppOptions {
  schema: Project;
  packages?: Package[];
  plugins?: Plugin[];
  /**
   * code runtime 设置选项
   */
  codeRuntime?: CodeRuntimeOptions;

  component?: {
    stateCreator?: ModelStateCreator;
    /**
     * 数据源创建工厂函数
     */
    dataSourceCreator?: ModelDataSourceCreator;
  } & Pick<ComponentOptions, 'beforeElementCreate' | 'elementCreated' | 'componentRefAttached'>;

  faultComponent?: ComponentType<any>;
}

export class App extends Disposable implements IRendererApplication {
  private _root?: Root;

  private instantiationService: InstantiationService;

  get mode() {
    return __DEV__ ? 'development' : 'production';
  }

  private _router: Router;
  get router() {
    return this._router;
  }

  private _components?: ComponentsAccessor;
  get components() {
    if (!this._components) {
      this._components = this.instantiationService.invokeFunction((accessor) => {
        const packageManager = accessor.get(IPackageManagementService);
        return {
          getComponent: packageManager.getComponent.bind(packageManager),
        };
      });
    }
    return this._components;
  }

  private _schema?: SchemaAccessor;
  get schema() {
    if (!this._schema) {
      this._schema = this.instantiationService.invokeFunction((accessor) => {
        const schemaService = accessor.get(ISchemaService);
        return {
          get: schemaService.get.bind(schemaService),
        };
      });
    }

    return this._schema;
  }

  private _codeRuntime?: ICodeRuntime;
  get codeRuntime() {
    if (!this._codeRuntime) {
      return this.instantiationService.invokeFunction((accessor) => {
        return accessor.get(ICodeRuntimeService).rootRuntime;
      });
    }
    return this._codeRuntime;
  }

  constructor(public readonly options: AppOptions) {
    super();
    this._createServices();
  }

  async startup() {
    await this._initServices();
    await this._createRouter();
  }

  private _createServices() {
    const container = new BeanContainer();

    // create services
    container.set(ISchemaService, new SchemaService());
    container.set(IRuntimeIntlService, new RuntimeIntlService());

    container.set(ICodeRuntimeService, new CtorDescriptor(CodeRuntimeService));
    container.set(IPackageManagementService, new CtorDescriptor(PackageManagementService));
    container.set(IExtensionHostService, new CtorDescriptor(ExtensionHostService));
    container.set(IRuntimeUtilService, new CtorDescriptor(RuntimeUtilService));

    container.set(IReactRendererBoostsService, new CtorDescriptor(ReactRendererBoostsService));

    this.instantiationService = this._addDispose(new InstantiationService(container));
  }

  private async _initServices() {
    const [
      schemaService,
      extensionHostService,
      packageManagementService,
      utilService,
      intlService,
    ] = this.instantiationService.invokeFunction((accessor) => [
      accessor.get(ISchemaService),
      accessor.get(IExtensionHostService),
      accessor.get(IPackageManagementService),
      accessor.get(IRuntimeUtilService),
      accessor.get(IRuntimeIntlService),
    ]);

    // init services
    schemaService.initialize(this.options.schema);

    const defaultLocale = schemaService.get<string>('config.defaultLocale');
    const i18ns = schemaService.get('i18n', {});

    const [intlApi, utilApi] = [
      intlService.initialize(defaultLocale, i18ns),
      utilService.initialize(),
    ];
    this.codeRuntime.getScope().set('intl', intlApi);
    this.codeRuntime.getScope().set('utils', utilApi);

    await extensionHostService.registerPlugin(this.options.plugins ?? []);

    await packageManagementService.loadPackages(this.options.packages ?? []);
  }

  private async _createRouter() {
    const defaultRouterOptions: RouterOptions = {
      historyMode: 'browser',
      baseName: '/',
      routes: [],
    };

    let routerConfig = defaultRouterOptions;

    try {
      const routerSchema = this.schema.get('router');
      if (routerSchema) {
        routerConfig = this.codeRuntime.resolve(routerSchema);
      }
    } catch (e) {
      console.error(`schema's router config is resolve error: `, e);
    }

    this._router = createRouter(routerConfig);

    this.codeRuntime.getScope().set('router', this._router);

    await this._router.isReady();
  }

  async mount(containerOrId?: string | HTMLElement) {
    this._throwIfDisposed(`this app has been destroyed`);

    if (this._root) return;

    const reactBoosts = this.instantiationService.invokeFunction((accessor) => {
      return accessor.get(IReactRendererBoostsService);
    });

    const defaultId = this.schema.get<string>('config.targetRootID', 'app');
    const rootElement = normalizeContainer(containerOrId, defaultId);

    const AppView = createAppView(this, reactBoosts.getAppWrappers(), reactBoosts.getOutlet());

    this._root = createRoot(rootElement);
    this._root.render(createElement(AppView));
  }

  unmount() {
    this._throwIfDisposed(`this app has been destroyed`);

    if (this._root) {
      this._root.unmount();
      this._root = undefined;
    }
  }

  use(plugin: Plugin<ReactRendererBoostsApi>) {
    this._throwIfDisposed(`this app has been destroyed`);

    const extensionHostService = this.instantiationService.invokeFunction((accessor) => {
      return accessor.get(IExtensionHostService);
    });

    return extensionHostService.registerPlugin(plugin);
  }

  destroy() {
    this.dispose();
  }
}

function normalizeContainer(container: Element | string | undefined, defaultId: string): Element {
  let result: Element | undefined = undefined;

  if (typeof container === 'string') {
    const el = document.getElementById(container);
    if (el) result = el;
  } else if (container instanceof window.Element) {
    result = container;
  }

  if (!result) {
    result = document.createElement('div');
    result.id = defaultId;
  }

  return result;
}

export function defineRendererPlugin(plugin: Plugin<ReactRendererBoostsApi>) {
  return plugin;
}
