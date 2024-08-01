import { createDecorator, CyclicDependencyError, Disposable, Graph } from '@alilc/lowcode-shared';
import { type Plugin, type PluginContext } from './plugin';
import { BoostsManager } from './boosts';
import { IPackageManagementService } from '../package';
import { ISchemaService } from '../schema';
import { ILifeCycleService } from '../life-cycle/lifeCycleService';
import { ICodeRuntimeService } from '../code-runtime';
import { IRuntimeIntlService } from '../intl';
import { IRuntimeUtilService } from '../util';

export interface IExtensionHostService {
  readonly boostsManager: BoostsManager;

  registerPlugin(plugin: Plugin | Plugin[]): Promise<void>;

  getPlugin(name: string): Plugin | undefined;
}

export const IExtensionHostService =
  createDecorator<IExtensionHostService>('pluginManagementService');

export class ExtensionHostService extends Disposable implements IExtensionHostService {
  boostsManager: BoostsManager;

  private _activePlugins = new Set<string>();
  private _pluginStore = new Map<string, Plugin>();
  private _pluginDependencyGraph = new Graph<string>((name) => name);
  private _pluginSetupContext: PluginContext;

  constructor(
    @ILifeCycleService lifeCycleService: ILifeCycleService,
    @IPackageManagementService packageManagementService: IPackageManagementService,
    @ISchemaService schemaService: ISchemaService,
    @ICodeRuntimeService codeRuntimeService: ICodeRuntimeService,
    @IRuntimeIntlService runtimeIntlService: IRuntimeIntlService,
    @IRuntimeUtilService runtimeUtilService: IRuntimeUtilService,
  ) {
    super();

    this.boostsManager = new BoostsManager(
      codeRuntimeService,
      runtimeIntlService,
      runtimeUtilService,
    );

    this._pluginSetupContext = {
      globalState: new Map(),
      boosts: this.boostsManager.toExpose(),
      schema: schemaService,
      packageManager: packageManagementService,

      whenLifeCylePhaseChange: (phase) => {
        return lifeCycleService.when(phase);
      },
    };
  }

  async registerPlugin(plugins: Plugin | Plugin[]) {
    const items = (Array.isArray(plugins) ? plugins : [plugins]).filter(
      (plugin) => !this._pluginStore.has(plugin.name),
    );

    for (const item of items) {
      this._pluginStore.set(item.name, item);
    }

    await this._doRegisterPlugins(items);
  }

  private async _doRegisterPlugins(plugins: Plugin[]) {
    for (const plugin of plugins) {
      this._pluginDependencyGraph.lookupOrInsertNode(plugin.name);

      if (plugin.dependsOn) {
        for (const dependency of plugin.dependsOn) {
          this._pluginDependencyGraph.insertEdge(plugin.name, dependency);
        }
      }
    }

    while (true) {
      const roots = this._pluginDependencyGraph.roots();

      if (roots.length === 0 || roots.every((node) => !this._pluginStore.has(node.data))) {
        if (this._pluginDependencyGraph.isEmpty()) {
          throw new CyclicDependencyError(this._pluginDependencyGraph);
        }
        break;
      }

      for (const { data } of roots) {
        const plugin = this._pluginStore.get(data);
        if (plugin) {
          await this._doSetupPlugin(plugin);
          this._pluginDependencyGraph.removeNode(plugin.name);
        }
      }
    }
  }

  private async _doSetupPlugin(plugin: Plugin) {
    if (this._activePlugins.has(plugin.name)) return;

    await plugin.setup(this._pluginSetupContext);
    this._activePlugins.add(plugin.name);
    this._addDispose(plugin);
  }

  getPlugin(name: string): Plugin | undefined {
    return this._pluginStore.get(name);
  }
}
