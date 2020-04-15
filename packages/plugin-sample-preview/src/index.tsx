import React from 'react';
import { Button } from '@alifd/next';
import { PluginProps } from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import './index.scss';

const SamplePreview = ({ editor }: PluginProps) => {
  const handleClick = () => {
    const designer = editor.get(Designer);
    console.info('save schema:', designer.schema);
    localStorage.setItem('lce-dev-store', JSON.stringify(designer.schema));
    window.open('./preview.html', 'preview');
  };

  return (
    <div className="lowcode-plugin-sample-preview">
      <Button type="primary" onClick={handleClick}>
        预览
      </Button>
    </div>
  );
};

export default SamplePreview;
