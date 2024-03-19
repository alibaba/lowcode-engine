import type { Project, Package, PlainObject } from '../types';
import { type PackageManager, createPackageManager } from '../package';
import { createPluginManager, type Plugin } from '../plugin';
import { createScope, type CodeScope } from '../code-runtime';
import { appBoosts, type AppBoosts, type AppBoostsManager } from '../boosts';
import { type AppSchema, createAppSchema } from '../schema';

export interface AppOptionsBase {
  schema: Project;
  packages?: Package[];
  plugins?: Plugin[];
  appScopeValue?: PlainObject;
}

export interface AppBase {
  mount: (el: HTMLElement) => void | Promise<void>;
  unmount: () => void | Promise<void>;
}

/**
 * context for plugin or renderer
 */
export interface AppContext {
  schema: AppSchema;
  config: Map<string, any>;
  appScope: CodeScope;
  packageManager: PackageManager;
  boosts: AppBoostsManager;
}

type AppCreator<O, T extends AppBase> = (
  appContext: Omit<AppContext, 'renderer'>,
  appOptions: O,
) => Promise<{ appBase: T; renderer?: any }>;

export type App<T extends AppBase = AppBase> = {
  schema: Project;
  config: Map<string, any>;
  readonly boosts: AppBoosts;

  use(plugin: Plugin): Promise<void>;
} & T;

/**
 * 创建应用
 * @param schema
 * @param options
 * @returns
 */
export function createAppFunction<O extends AppOptionsBase, T extends AppBase = AppBase>(
  appCreator: AppCreator<O, T>,
): (options: O) => Promise<App<T>> {
  if (typeof appCreator !== 'function') {
    throw Error('The first parameter must be a function.');
  }

  return async (options) => {
    const { schema, appScopeValue = {} } = options;
    const appSchema = createAppSchema(schema);
    const appConfig = new Map<string, any>();
    const packageManager = createPackageManager();
    const appScope = createScope({
      ...appScopeValue,
      constants: schema.constants ?? {},
    });

    const appContext = {
      schema: appSchema,
      config: appConfig,
      appScope,
      packageManager,
      boosts: appBoosts,
    };

    const { appBase, renderer } = await appCreator(appContext, options);

    if (!('mount' in appBase) || !('unmount' in appBase)) {
      throw Error('appBase 必须返回 mount 和 unmount 方法');
    }

    const pluginManager = createPluginManager({
      ...appContext,
      renderer,
    });

    if (options.plugins?.length) {
      await Promise.all(options.plugins.map((p) => pluginManager.add(p)));
    }

    if (options.packages?.length) {
      await packageManager.addPackages(options.packages);
    }

    return Object.assign(
      {
        schema,
        config: appConfig,
        use: pluginManager.add,
        get boosts() {
          return appBoosts.value;
        },
      },
      appBase,
    );
  };
}
