import React, { useState } from 'react';
import { Button, Dialog } from '@alifd/next';
import { PluginProps } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';
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
      console.info('save schema:', designer.schema);

      const { components } = await editor.get('assets');
      setData({
        schema: designer.schema,
        components,
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
          schema={schema.componentsTree[0]}
          components={components}
        />}
      </Dialog>
    </div>
  );
};

export default SamplePreview;
