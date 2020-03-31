function isESModule(obj: any): obj is { [key: string]: any } {
  return obj && obj.__esModule;
}

function accessLibrary(library: string | object) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library];
}

function getSubComponent(library: any, paths: string[]) {
  const l = paths.length;
  if (l < 1 || !library) {
    return library;
  }
  let i = 0;
  let component: any;
  while (i < l) {
    const key = paths[i]!;
    let ex: any;
    try {
      component = library[key];
    } catch (e) {
      ex = e;
      component = null;
    }
    if (i === 0 && component == null && key === 'default') {
      if (ex) {
        return l === 1 ? library : null;
      }
      component = library;
    } else if (component == null) {
      return null;
    }
    library = component;
    i++;
  }
  return component;
}

function findComponent(libraryMap: LibraryMap, componentName: string, npm?: NpmInfo) {
  if (!npm) {
    return accessLibrary(componentName);
  }
  // libraryName the key access to global
  // export { exportName } from xxx exportName === global.libraryName.exportName
  // export exportName from xxx   exportName === global.libraryName.default || global.libraryName
  // export { exportName as componentName } from package
  // if exportName == null exportName === componentName;
  // const componentName = exportName.subName, if exportName empty subName donot use
  const exportName = npm.exportName || npm.componentName || componentName;
  const libraryName = libraryMap[npm.package] || exportName;
  const library = accessLibrary(libraryName);
  const paths = npm.exportName && npm.subName ? npm.subName.split('.') : [];
  if (npm.destructuring) {
    paths.unshift(exportName);
  } else if (isESModule(library)) {
    paths.unshift('default');
  }
  return getSubComponent(library, paths);
}

export interface LibraryMap {
  [key: string]: string;
}

export interface NpmInfo {
  componentName?: string;
  package: string;
  version: string;
  destructuring?: boolean;
  exportName?: string;
  subName?: string;
  main?: string;
}

export function buildComponents(
  libraryMap: LibraryMap,
  componentsMap: { [componentName: string]: NpmInfo } | NpmInfo[],
) {
  const components: any = {};
  if (componentsMap && Array.isArray(componentsMap)) {
    const compMapObj: any = {};
    componentsMap.forEach((item: NpmInfo) => {
      if (!item || !item.componentName) {
        return;
      }
      compMapObj[item.componentName] = item;
    });
    componentsMap = compMapObj;
  }
  Object.keys(componentsMap).forEach((componentName) => {
    const component = findComponent(libraryMap, componentName, (componentsMap as any)[componentName]);
    if (component) {
      components[componentName] = component;
    }
  });
  return components;
}
