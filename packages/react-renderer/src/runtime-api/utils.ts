import {
  createCodeRuntime,
  type PackageManager,
  type AnyFunction,
  type Util,
  type UtilsApi,
} from '@alilc/renderer-core';

export interface RuntimeUtils extends UtilsApi {
  addUtil(utilItem: Util): void;
  addUtil(name: string, fn: AnyFunction): void;
}

export function createRuntimeUtils(
  utilSchema: Util[],
  packageManager: PackageManager,
): RuntimeUtils {
  const codeRuntime = createCodeRuntime();
  const utilsMap: Record<string, AnyFunction> = {};

  function addUtil(item: string | Util, fn?: AnyFunction) {
    if (typeof item === 'string') {
      if (typeof fn === 'function') {
        utilsMap[item] = fn;
      }
    } else {
      const fn = parseUtil(item);
      addUtil(item.name, fn);
    }
  }

  function parseUtil(utilItem: Util) {
    if (utilItem.type === 'function') {
      const { content } = utilItem;

      return codeRuntime.createFnBoundScope(content.value);
    } else {
      const {
        content: { package: packageName, destructuring, exportName, subName },
      } = utilItem;
      let library: any = packageManager.getLibraryByPackageName(packageName!);

      if (library) {
        if (destructuring) {
          const target = library[exportName!];
          library = subName ? target[subName] : target;
        }

        return library;
      }
    }
  }

  utilSchema.forEach((item) => addUtil(item));

  const utilsProxy = new Proxy(Object.create(null), {
    get(_, p: string) {
      return utilsMap[p];
    },
    set() {
      return false;
    },
    has(_, p: string) {
      return Boolean(utilsMap[p]);
    },
  });

  return {
    addUtil,
    utils: utilsProxy,
  };
}
