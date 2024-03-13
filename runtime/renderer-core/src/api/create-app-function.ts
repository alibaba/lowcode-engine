import {
  type ProjectSchema,
  type Package,
  type AnyObject,
} from '@alilc/runtime-shared';
import { type PackageManager, createPackageManager } from '../core/package';
import { createPluginManager, type Plugin } from '../core/plugin';
import { createScope, type CodeScope } from '../core/codeRuntime';
import {
  appBoosts,
  type AppBoosts,
  type AppBoostsManager,
} from '../core/boosts';
import { type AppSchema, createAppSchema } from '../core/schema';

export interface AppOptionsBase {
  schema: ProjectSchema;
  packages?: Package[];
  plugins?: Plugin[];
  appScopeValue?: AnyObject;
}

export interface RenderBase {
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

type AppCreator<O, T> = (
  appContext: Omit<AppContext, 'renderer'>,
  appOptions: O
) => Promise<{ renderBase: T; renderer?: any }>;

export type App<T extends RenderBase = RenderBase> = {
  schema: ProjectSchema;
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
export function createAppFunction<
  O extends AppOptionsBase,
  T extends RenderBase = RenderBase
>(appCreator: AppCreator<O, T>): (options: O) => Promise<App<T>> {
  return async options => {
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

    const { renderBase, renderer } = await appCreator(appContext, options);
    const pluginManager = createPluginManager({
      ...appContext,
      renderer,
    });

    if (options.plugins?.length) {
      await Promise.all(options.plugins.map(p => pluginManager.add(p)));
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
      renderBase
    );
  };
}
