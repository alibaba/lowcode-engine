function isESModule(obj) {
  return obj && obj.__esModule;
}

function getSubComponent(library, paths) {
  const l = paths.length;
  if (l < 1 || !library) {
    return library;
  }
  let i = 0;
  let component;
  while (i < l) {
    const key = paths[i];
    let ex;
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

function accessLibrary(library) {
  if (typeof library !== 'string') {
    return library;
  }

  return window[library];
}

function findComponent(libraryMap, componentName, npm) {
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

export function buildComponents(libraryMap, componentsMap) {
  const components = {};
  Object.keys(componentsMap).forEach((componentName) => {
    const component = findComponent(libraryMap, componentName, componentsMap[componentName]);
    if (component) {
      components[componentName] = component;
    }
  });
  return components;
}
