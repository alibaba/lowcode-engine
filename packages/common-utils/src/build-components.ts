import { NpmInfo, ComponentSchema } from '@alilc/lowcode-types';
import { Component } from '@alilc/lowcode-designer';
import { isESModule } from './is-es-module';

export function accessCommonLibrary(library: string | Record<string, unknown>) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library];
}

export function getSubComponent(library: any, paths: string[]) {
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

export function findComponent(libraryMap: LibraryMap, componentName: string, npm?: NpmInfo) {
  if (!npm) {
    return accessCommonLibrary(componentName);
  }
  // libraryName the key access to global
  // export { exportName } from xxx exportName === global.libraryName.exportName
  // export exportName from xxx   exportName === global.libraryName.default || global.libraryName
  // export { exportName as componentName } from package
  // if exportName == null exportName === componentName;
  // const componentName = exportName.subName, if exportName empty subName donot use
  const exportName = npm.exportName || npm.componentName || componentName;
  const libraryName = libraryMap[npm.package] || exportName;
  const library = accessCommonLibrary(libraryName);
  const paths = npm.exportName && npm.subName ? npm.subName.split('.') : [];
  if (npm.destructuring) {
    paths.unshift(exportName);
  } else if (isESModule(library)) {
    paths.unshift('default');
  }
  return getSubComponent(library, paths);
}

export function buildCommonComponents(libraryMap: LibraryMap,
  componentsMap: { [componentName: string]: NpmInfo | ComponentSchema },
  createComponent: (schema: ComponentSchema) => Component | null) {
  const components: any = {};
  Object.keys(componentsMap).forEach((componentName) => {
    let component = componentsMap[componentName];
    if (component && (component as ComponentSchema).componentName === 'Component') {
      components[componentName] = createComponent(component as ComponentSchema);
    } else {
      component = findComponent(libraryMap, componentName, component as NpmInfo);
      if (component) {
        components[componentName] = component;
      }
    }
  });
  return components;
}

export interface UtilsMetadata {
  name: string;
  npm: {
    package: string;
    version?: string;
    exportName: string;
    subName?: string;
    destructuring?: boolean;
    main?: string;
  };
}

export interface LibraryMap {
  [key: string]: string;
}

export interface ProjectUtils {
  [packageName: string]: any;
}

export function getCommonProjectUtils(libraryMap: LibraryMap, utilsMetadata: UtilsMetadata[]): ProjectUtils {
  const projectUtils: ProjectUtils = {};
  if (utilsMetadata) {
    utilsMetadata.forEach(meta => {
      if (libraryMap[meta?.npm?.package]) {
        const lib = accessCommonLibrary(libraryMap[meta?.npm.package]);
        if (lib?.destructuring) {
          Object.keys(lib).forEach(name => {
            if (name === 'destructuring') return;
            projectUtils[name] = lib[name];
          });
        } else if (meta.name) {
          projectUtils[meta.name] = lib;
        }
      }
    });
  }
  return projectUtils;
}