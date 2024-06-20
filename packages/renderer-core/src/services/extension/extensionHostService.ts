import { createDecorator, Provide, EventEmitter, KeyValueStore } from '@alilc/lowcode-shared';
import { type Plugin, type PluginContext } from './plugin';
import { IBoostsService } from './boosts';
import { IPackageManagementService } from '../package';
import { ISchemaService } from '../schema';
import { ILifeCycleService, LifecyclePhase } from '../lifeCycleService';

interface IPluginRuntime extends Plugin {
  status: 'setup' | 'ready';
}

export interface IExtensionHostService {
  registerPlugin(plugin: Plugin | Plugin[]): Promise<void>;

  getPlugin(name: string): Plugin | undefined;

  dispose(): Promise<void>;
}

export const IExtensionHostService =
  createDecorator<IExtensionHostService>('pluginManagementService');

@Provide(IExtensionHostService)
export class ExtensionHostService implements IExtensionHostService {
  private pluginRuntimes: IPluginRuntime[] = [];

  private eventEmitter: EventEmitter;

  private pluginSetupContext: PluginContext;

  constructor(
    @IPackageManagementService private packageManagementService: IPackageManagementService,
    @IBoostsService private boostsService: IBoostsService,
    @ISchemaService private schemaService: ISchemaService,
    @ILifeCycleService private lifeCycleService: ILifeCycleService,
  ) {
    this.eventEmitter = new EventEmitter('ExtensionHost');
    this.pluginSetupContext = {
      eventEmitter: this.eventEmitter,
      globalState: new KeyValueStore(),
      boosts: this.boostsService.toExpose(),
      schema: this.schemaService,
      packageManager: this.packageManagementService,

      whenLifeCylePhaseChange: (phase) => {
        return this.lifeCycleService.when(phase);
      },
    };
  }

  async registerPlugin(plugins: Plugin | Plugin[]) {
    plugins = Array.isArray(plugins) ? plugins : [plugins];

    for (const plugin of plugins) {
      if (this.pluginRuntimes.find((item) => item.name === plugin.name)) {
        console.warn(`${plugin.name} 插件已注册`);
        continue;
      }

      const pluginRuntime = plugin as IPluginRuntime;

      pluginRuntime.status = 'ready';
      this.pluginRuntimes.push(pluginRuntime);

      await this.doSetupPlugin(pluginRuntime);
    }
  }

  private async doSetupPlugin(pluginRuntime: IPluginRuntime) {
    if (pluginRuntime.status === 'setup') return;

    const isSetup = (name: string) => {
      const setupPlugins = this.pluginRuntimes.filter((item) => item.status === 'setup');
      return setupPlugins.some((p) => p.name === name);
    };

    if (pluginRuntime.dependsOn?.some((dep) => !isSetup(dep))) {
      return;
    }

    await pluginRuntime.setup(this.pluginSetupContext);
    pluginRuntime.status = 'setup';

    // 遍历未安装的插件 寻找 dependsOn 的插件已安装完的插件进行安装
    const readyPlugins = this.pluginRuntimes.filter((item) => item.status === 'ready');
    const readyPlugin = readyPlugins.find((item) => item.dependsOn?.every((dep) => isSetup(dep)));
    if (readyPlugin) {
      await this.doSetupPlugin(readyPlugin);
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.pluginRuntimes.find((item) => item.name === name);
  }

  async dispose(): Promise<void> {
    for (const plugin of this.pluginRuntimes) {
      await plugin.destory?.();
    }
  }
}
