import { ComponentType, forwardRef, createElement, FunctionComponent } from 'react';
import { NpmInfo, ComponentSchema } from '@alilc/lowcode-types';
import { Component } from '@alilc/lowcode-designer';
import { findComponent, isObject, LibraryMap, ProjectUtils, UtilsMetadata } from '@alilc/lowcode-common-utils';
import { isReactComponent, acceptsRef, wrapReactClass } from './is-react';

export function accessReactLibrary(library: string | Record<string, unknown>) {
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

/**
 * 判断是否是一个混合组件，即 components 是一个对象，对象值是 React 组件
 * 示例：
 * {
 *    Button: ReactNode,
 *    Text: ReactNode,
 * }
 */
function isMixinComponent(components: any) {
  if (!isObject(components)) {
    return false;
  }

  return Object.keys(components).some(componentName => isReactComponent(components[componentName]));
}

export function buildReactComponents(libraryMap: LibraryMap,
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
    } else if (isMixinComponent(component)) {
      components[componentName] = component;
    } else {
      component = findComponent(libraryMap, componentName, component as any);
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

export function getReactProjectUtils(libraryMap: LibraryMap, utilsMetadata: UtilsMetadata[]): ProjectUtils {
  const projectUtils: ProjectUtils = {};
  if (utilsMetadata) {
    utilsMetadata.forEach(meta => {
      if (libraryMap[meta?.npm?.package]) {
        const lib = accessReactLibrary(libraryMap[meta?.npm.package]);
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