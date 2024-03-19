import { createCodeRuntime, type PackageManager } from '@alilc/runtime-core';
import {
  type UtilItem,
  type InternalUtils,
  type ExternalUtils,
  type AnyFunction,
} from '@alilc/runtime-shared';
import { definePlugin } from '../../renderer';

declare module '@alilc/runtime-core' {
  interface AppBoosts {
    globalUtils: GlobalUtils;
  }
}

export interface GlobalUtils {
  getUtil(name: string): AnyFunction;

  addUtil(utilItem: UtilItem): void;
  addUtil(name: string, fn: AnyFunction): void;

  addUtils(utils: Record<string, AnyFunction>): void;
}

export const globalUtilsPlugin = definePlugin({
  name: 'globalUtils',
  setup({ schema, appScope, packageManager, boosts }) {
    const utils = schema.getByKey('utils') ?? [];
    const globalUtils = createGlobalUtils(packageManager);

    const utilsProxy = new Proxy(Object.create(null), {
      get(_, p: string) {
        return globalUtils.getUtil(p);
      },
      set() {
        return false;
      },
      has(_, p: string) {
        return Boolean(globalUtils.getUtil(p));
      },
    });

    utils.forEach(globalUtils.addUtil);

    appScope.inject('utils', utilsProxy);
    boosts.add('globalUtils', globalUtils);
  },
});

function createGlobalUtils(packageManager: PackageManager) {
  const codeRuntime = createCodeRuntime();
  const utilsMap: Record<string, AnyFunction> = {};

  function addUtil(item: string | UtilItem, fn?: AnyFunction) {
    if (typeof item === 'string') {
      if (typeof fn === 'function') {
        utilsMap[item] = fn;
      }
    } else {
      const fn = parseUtil(item);
      addUtil(item.name, fn);
    }
  }

  const globalUtils: GlobalUtils = {
    addUtil,
    addUtils(utils) {
      Object.keys(utils).forEach(key => addUtil(key, utils[key]));
    },
    getUtil(name) {
      return utilsMap[name];
    },
  };

  function parseUtil(utilItem: UtilItem) {
    if (utilItem.type === 'function') {
      const { content } = utilItem as InternalUtils;

      return codeRuntime.createFnBoundScope(content.value);
    } else {
      const {
        content: { package: packageName, destructuring, exportName, subName },
      } = utilItem as ExternalUtils;
      let library: any = packageManager.getLibraryByPackageName(packageName);

      if (library) {
        if (destructuring) {
          const target = library[exportName!];
          library = subName ? target[subName] : target;
        }

        return library;
      }
    }
  }

  return globalUtils;
}
