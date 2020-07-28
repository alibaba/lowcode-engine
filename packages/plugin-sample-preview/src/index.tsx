import React, { useState, ComponentType } from 'react';
import { Button, Dialog } from '@alifd/next';
import { PluginProps, NpmInfo } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';
import { isReactComponent, isESModule } from '@ali/lowcode-utils';
import ReactRenderer from '@ali/lowcode-react-renderer';
import './index.scss';

interface LibraryMap {
  [key: string]: string;
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

function buildComponents(libraryMap: LibraryMap, componentsMap: { [componentName: string]: NpmInfo | ComponentType<any> }) {
  const components: any = {
  };
  Object.keys(componentsMap).forEach((componentName) => {
    let component = componentsMap[componentName];
    if (isReactComponent(component)) {
      components[componentName] = component;
    } else {
      component = findComponent(libraryMap, componentName, component);
      if (component) {
        components[componentName] = component;
      }
    }
  });
  return components;
}

const SamplePreview = ({ editor }: PluginProps) => {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  async function handleClick() {
    if (!editor) {
      return;
    }
    const designer = editor.get(Designer);
    if (designer) {
      const assets = await editor.get('assets');
      console.info('save schema:', designer, assets);

      const libraryMap: LibraryMap = {};
      assets.packages.forEach(({ package, library }) => {
        libraryMap[package] = library;
      });
      setData({
        schema: designer.schema.componentsTree[0],
        components: buildComponents(libraryMap, designer.componentsMap),
      });
      setVisible(true);
    }
  };

  function handleClose() {
    setVisible(false);
  }

  const { schema, components } = data;
  return (
    <div className="lowcode-plugin-sample-preview">
      <Button type="primary" onClick={handleClick}>
        预览
      </Button>
      <Dialog
        visible={visible}
        footer={false}
        onClose={handleClose}
      >
        {visible && <ReactRenderer 
          schema={schema}
          components={components}
        />}
      </Dialog>
    </div>
  );
};

export default SamplePreview;
