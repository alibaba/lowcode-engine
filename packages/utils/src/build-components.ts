import { ComponentType, forwardRef, createElement, FunctionComponent } from 'react';
import {
  IPublicTypeNpmInfo,
  IPublicTypeComponentSchema,
  IPublicTypeProjectSchema,
} from '@alilc/lowcode-types';
import { isESModule } from './is-es-module';
import { isReactComponent, acceptsRef, wrapReactClass } from './is-react';
import { isObject } from './is-object';
import { isLowcodeProjectSchema } from './check-types';
import { isComponentSchema } from './check-types/is-component-schema';

type Component = ComponentType<any> | object;
interface LibraryMap {
  [key: string]: string;
}

export function accessLibrary(library: string | Record<string, unknown>) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library] || generateHtmlComp(library);
}

export function generateHtmlComp(library: string): any {
  if (['a', 'img', 'div', 'span', 'svg'].includes(library)) {
    return forwardRef((props: any, ref) => {
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
      component = library[key] || component;
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

function findComponent(libraryMap: LibraryMap, componentName: string, npm?: IPublicTypeNpmInfo) {
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

  return Object.keys(components).some((componentName) =>
    isReactComponent(components[componentName]),
  );
}

export function buildComponents(
  libraryMap: LibraryMap,
  componentsMap: {
    [componentName: string]: IPublicTypeNpmInfo | ComponentType<any> | IPublicTypeComponentSchema;
  },
  createComponent: (
    schema: IPublicTypeProjectSchema<IPublicTypeComponentSchema>,
  ) => Component | null,
) {
  const components: any = {};
  Object.keys(componentsMap).forEach((componentName) => {
    let component = componentsMap[componentName];
    if (component && (isLowcodeProjectSchema(component) || isComponentSchema(component))) {
      if (isComponentSchema(component)) {
        components[componentName] = createComponent({
          version: '',
          componentsMap: [],
          componentsTree: [component],
        });
      } else {
        components[componentName] = createComponent(component);
      }
    } else if (isReactComponent(component)) {
      if (!acceptsRef(component)) {
        component = wrapReactClass(component as FunctionComponent);
      }
      components[componentName] = component;
    } else if (isMixinComponent(component)) {
      components[componentName] = component;
    } else {
      component = findComponent(libraryMap, componentName, component);
      if (component) {
        if (!acceptsRef(component) && isReactComponent(component)) {
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
  };
}

interface LibrayMap {
  [key: string]: string;
}

interface ProjectUtils {
  [packageName: string]: any;
}
export function getProjectUtils(
  librayMap: LibrayMap,
  utilsMetadata: UtilsMetadata[],
): ProjectUtils {
  const projectUtils: ProjectUtils = {};
  if (utilsMetadata) {
    utilsMetadata.forEach((meta) => {
      if (librayMap[meta?.npm?.package]) {
        const lib = accessLibrary(librayMap[meta?.npm.package]);
        if (lib?.destructuring) {
          Object.keys(lib).forEach((name) => {
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
