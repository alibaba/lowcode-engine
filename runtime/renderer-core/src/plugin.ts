import { type AppContext } from '../api/create-app-function';

export interface Plugin<C extends PluginSetupContext = PluginSetupContext> {
  name: string; // 插件的 name 作为唯一标识，并不可重复。
  setup(setupContext: C): void | Promise<void>;
  dependsOn?: string[];
}

export interface PluginSetupContext extends AppContext {
  [key: string]: any;
}

export function createPluginManager(context: PluginSetupContext) {
  const installedPlugins: Plugin[] = [];
  let readyToInstallPlugins: Plugin[] = [];

  const setupContext = new Proxy(context, {
    get(target, p, receiver) {
      return Reflect.get(target, p, receiver);
    },
    set() {
      return false;
    },
    has(target, p) {
      return Reflect.has(target, p);
    },
  });

  async function install(plugin: Plugin) {
    if (installedPlugins.some(p => p.name === plugin.name)) return;

    if (
      plugin.dependsOn?.some(dep => !installedPlugins.some(p => p.name === dep))
    ) {
      readyToInstallPlugins.push(plugin);
      return;
    }

    await plugin.setup(setupContext);
    installedPlugins.push(plugin);

    // 遍历未安装的插件 寻找 dependsOn 的插件已安装完的插件进行安装
    for (const item of readyToInstallPlugins) {
      if (
        item.dependsOn?.every(dep => installedPlugins.some(p => p.name === dep))
      ) {
        await item.setup(setupContext);
        installedPlugins.push(item);
      }
    }

    if (readyToInstallPlugins.length) {
      readyToInstallPlugins = readyToInstallPlugins.filter(item =>
        installedPlugins.some(p => p.name === item.name)
      );
    }
  }

  return {
    async add(plugin: Plugin) {
      if (installedPlugins.find(item => item.name === plugin.name)) {
        console.warn('该插件已安装');
        return;
      }

      await install(plugin);
    },
  };
}

export function definePlugin<C extends PluginSetupContext, P = Plugin<C>>(
  plugin: P
) {
  return plugin;
}
