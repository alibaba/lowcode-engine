import React, { useState } from 'react';
import { Button, Dialog } from '@alifd/next';
import { PluginProps } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';
import { buildComponents, assetBundle, AssetList, AssetLevel, AssetLoader } from '@ali/lowcode-utils';
import ReactRenderer from '@ali/lowcode-react-renderer';
import './index.scss';

const SamplePreview = ({ editor }: PluginProps) => {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  async function handleClick() {
    if (!editor) {
      return;
    }
    // 由于monaco editor的cdn加载形式会占用define字段，导致预览的时候部分next组件加载异常，所以预览弹框的时候需要对define做一个临时的替换
    window.__define = window.define;
    window.define = null;
    const designer = editor.get(Designer);
    if (designer) {
      const assets = await editor.get('assets');
      const { packages } = assets;
      const { componentsMap, schema } = designer;

      console.info('save schema:', designer, assets);

      const libraryMap = {};
      const libraryAsset: AssetList = [];
      packages.forEach(({ package, library, urls }) => {
        libraryMap[package] = library;
        if (urls) {
          libraryAsset.push(urls);
        }
      });

      const vendors = [
        assetBundle(libraryAsset, AssetLevel.Library),
      ];
      console.log('libraryMap&vendors', libraryMap, vendors);

      // TODO asset may cause pollution
      const assetLoader = new AssetLoader();
      await assetLoader.load(libraryAsset);
      const components = buildComponents(libraryMap, componentsMap);
      console.log('components', components);

      setData({
        schema: schema.componentsTree[0],
        components,
      });
      setVisible(true);


    }
  }

  function handleClose() {
    window.define = window.__define;
    setVisible(false);


  }

  const { schema, components } = data;
  return (
    <div className="lowcode-plugin-sample-preview">
      <Button type="primary" onClick={handleClick}>
        预览
      </Button>
      <Dialog visible={visible} footer={false} onClose={handleClose}>
        {visible &&
          <ReactRenderer className="lowcode-plugin-sample-preview-content" schema={schema} components={components} />
        }
      </Dialog>
    </div>
  );
};

export default SamplePreview;
