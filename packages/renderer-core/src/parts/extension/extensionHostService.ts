import {
  invariant,
  createDecorator,
  Provide,
  EventEmitter,
  KeyValueStore,
} from '@alilc/lowcode-shared';
import { type Plugin } from './plugin';
import { IBoostsService } from './boosts';
import { IPackageManagementService } from '../package';
import { ISchemaService } from '../schema';
import { type RenderAdapter } from './render';
import { IComponentTreeModelService } from '../component-tree-model';
import type { RendererApplication } from '../../types';

interface IPluginRuntime extends Plugin {
  status: 'setup' | 'ready';
}

export interface IExtensionHostService {
  initialize(app: RendererApplication): void;

  /* ========= plugin  ============= */
  registerPlugin(plugin: Plugin | Plugin[]): Promise<void>;

  getPlugin(name: string): Plugin | undefined;

  /* =========== render =============== */
  runRender<Render>(adapter: RenderAdapter<Render>): Promise<Render>;

  dispose(): Promise<void>;
}

export const IExtensionHostService =
  createDecorator<IExtensionHostService>('pluginManagementService');

@Provide(IExtensionHostService)
export class ExtensionHostService implements IExtensionHostService {
  private pluginRuntimes: IPluginRuntime[] = [];

  private app: RendererApplication;

  private eventEmitter = new EventEmitter();

  private globalState = new KeyValueStore();

  constructor(
    @IPackageManagementService private packageManagementService: IPackageManagementService,
    @IBoostsService private boostsService: IBoostsService,
    @ISchemaService private schemaService: ISchemaService,
    @IComponentTreeModelService private componentTreeModelService: IComponentTreeModelService,
  ) {}

  initialize(app: RendererApplication) {
    this.app = app;
  }

  async registerPlugin(plugins: Plugin | Plugin[]) {
    plugins = Array.isArray(plugins) ? plugins : [plugins];

    for (const plugin of plugins) {
      if (this.pluginRuntimes.find((item) => item.name === plugin.name)) {
        console.warn(`${plugin.name} 插件已注册`);
        continue;
      }

      await this.doSetupPlugin(plugin);
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.pluginRuntimes.find((item) => item.name === name);
  }

  async runRender<Render>(adapter: RenderAdapter<Render>): Promise<Render> {
    invariant(adapter, 'render adapter not settled', 'ExtensionHostService');

    return adapter({
      schema: this.schemaService,
      packageManager: this.packageManagementService,
      boostsManager: this.boostsService,
      componentTreeModel: this.componentTreeModelService,
    });
  }

  async dispose(): Promise<void> {
    for (const plugin of this.pluginRuntimes) {
      await plugin.destory?.();
    }
  }

  private async doSetupPlugin(plugin: Plugin) {
    const pluginRuntime = plugin as IPluginRuntime;

    if (!this.pluginRuntimes.some((item) => item.name !== pluginRuntime.name)) {
      this.pluginRuntimes.push({
        ...pluginRuntime,
        status: 'ready',
      });
    }

    const isSetup = (name: string) => {
      const setupPlugins = this.pluginRuntimes.filter((item) => item.status === 'setup');
      return setupPlugins.some((p) => p.name === name);
    };

    if (pluginRuntime.dependsOn?.some((dep) => !isSetup(dep))) {
      return;
    }

    await pluginRuntime.setup(this.app, {
      eventEmitter: this.eventEmitter,
      globalState: this.globalState,
      boosts: this.boostsService.toExpose(),
    });
    pluginRuntime.status = 'setup';

    // 遍历未安装的插件 寻找 dependsOn 的插件已安装完的插件进行安装
    const readyPlugins = this.pluginRuntimes.filter((item) => item.status === 'ready');
    const readyPlugin = readyPlugins.find((item) => item.dependsOn?.every((dep) => isSetup(dep)));
    if (readyPlugin) {
      await this.doSetupPlugin(readyPlugin);
    }
  }
}
