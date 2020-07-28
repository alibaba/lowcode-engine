import React, { useState, ComponentType } from 'react';
import { Button, Dialog } from '@alifd/next';
import { PluginProps, NpmInfo } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';
import { buildComponents } from '@ali/lowcode-utils';
import ReactRenderer from '@ali/lowcode-react-renderer';
import './index.scss';

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

      const libraryMap = {};
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
