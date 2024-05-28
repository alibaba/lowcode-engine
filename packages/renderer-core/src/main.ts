import { Injectable } from '@alilc/lowcode-shared';
import { ICodeRuntimeService } from './parts/code-runtime';
import { IExtensionHostService, type RenderAdapter } from './parts/extension';
import { IPackageManagementService } from './parts/package';
import { IRuntimeUtilService } from './parts/runtimeUtil';
import { IRuntimeIntlService } from './parts/runtimeIntl';
import { ISchemaService } from './parts/schema';

import type { AppOptions, RendererApplication } from './types';

@Injectable()
export class RendererMain {
  private mode: 'development' | 'production' = 'production';

  private initOptions: AppOptions;

  constructor(
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IPackageManagementService private packageManagementService: IPackageManagementService,
    @IRuntimeUtilService private runtimeUtilService: IRuntimeUtilService,
    @IRuntimeIntlService private runtimeIntlService: IRuntimeIntlService,
    @ISchemaService private schemaService: ISchemaService,
    @IExtensionHostService private extensionHostService: IExtensionHostService,
  ) {}

  async initialize(options: AppOptions) {
    const { schema, mode } = options;

    if (mode) this.mode = mode;
    this.initOptions = { ...options };

    // valid schema
    this.schemaService.initialize(schema);

    // init intl
    const finalLocale = options.locale ?? navigator.language;
    const i18nTranslations = this.schemaService.get('i18n') ?? {};

    this.runtimeIntlService.initialize(finalLocale, i18nTranslations);
  }

  async startup<Render>(adapter: RenderAdapter<Render>): Promise<RendererApplication<Render>> {
    const render = await this.extensionHostService.runRender<Render>(adapter);

    // construct application
    const app = Object.freeze<RendererApplication<Render>>({
      mode: this.mode,
      schema: this.schemaService,
      packageManager: this.packageManagementService,
      ...render,

      use: (plugin) => {
        return this.extensionHostService.registerPlugin(plugin);
      },
    });

    // setup plugins
    this.extensionHostService.initialize(app);
    await this.extensionHostService.registerPlugin(this.initOptions.plugins ?? []);

    // load packages
    await this.packageManagementService.loadPackages(this.initOptions.packages ?? []);

    // resolve component maps
    const componentsMaps = this.schemaService.get('componentsMap');
    this.packageManagementService.resolveComponentMaps(componentsMaps);

    this.initGlobalScope();

    return app;
  }

  private initGlobalScope() {
    // init runtime uitls
    const utils = this.schemaService.get('utils') ?? [];
    for (const util of utils) {
      this.runtimeUtilService.add(util);
    }

    const globalScope = this.codeRuntimeService.getScope();
    globalScope.setValue({
      utils: this.runtimeUtilService.toExpose(),
      ...this.runtimeIntlService.toExpose(),
    });
  }
}
