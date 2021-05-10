import { ComponentType, forwardRef, createElement, FunctionComponent } from 'react';
import { NpmInfo, ComponentSchema } from '@ali/lowcode-types';
import { Component } from '@ali/lowcode-designer';
import { isESModule } from './is-es-module';
import { isReactComponent, acceptsRef, wrapReactClass } from './is-react';

interface LibraryMap {
  [key: string]: string;
}

export function accessLibrary(library: string | Record<string, unknown>) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library] || generateHtmlComp(library);
}

export function generateHtmlComp(library: string) {
  if (['a', 'img', 'div', 'span', 'svg'].includes(library)) {
    return forwardRef((props, ref) => {
      return createElement(library, { ref, ...props }, props.children);
    });
  }
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

export function buildComponents(libraryMap: LibraryMap,
  componentsMap: { [componentName: string]: NpmInfo | ComponentType<any> | ComponentSchema },
  createComponent: (schema: ComponentSchema) => Component | null) {
  const components: any = {};
  Object.keys(componentsMap).forEach((componentName) => {
    let component = componentsMap[componentName];
    if (component && (component as ComponentSchema).componentName === 'Component') {
      components[componentName] = createComponent(component as ComponentSchema);
    } else if (isReactComponent(component)) {
      if (!acceptsRef(component)) {
        component = wrapReactClass(component as FunctionComponent);
      }
      components[componentName] = component;
    } else {
      component = findComponent(libraryMap, componentName, component);
      if (component) {
        if (!acceptsRef(component)) {
          component = wrapReactClass(component as FunctionComponent);
        }
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
  }
}

interface LibrayMap {
  [key: string]: string;
}

export function getProjectUtils(librayMap: LibrayMap, utilsMetadata: UtilsMetadata[]) {
  const projectUtils: { [packageName: string]: any } = {};
  if (utilsMetadata) {
    utilsMetadata.forEach(meta => {
      if (librayMap[meta?.npm?.package]) {
        const lib = accessLibrary(librayMap[meta?.npm.package]);
        if (lib.destructuring) {
          Object.keys(lib).forEach(name => {
            if (name === 'destructuring') return;
            projectUtils[name] = lib[name];
          });
        } else {
          projectUtils[meta?.npm?.exportName] = lib;
        }
      }
    });
  }
  return projectUtils;
}