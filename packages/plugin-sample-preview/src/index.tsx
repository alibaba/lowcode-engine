import React from 'react';
import { Button } from '@alifd/next';
import { PluginProps } from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import './index.scss';

const SamplePreview = ({ editor }: PluginProps) => {
  const handleClick = () => {
    const designer = editor.get(Designer);
    if (designer) {
      console.info('save schema:', designer.schema);
      localStorage.setItem('lce-dev-store', JSON.stringify(designer.schema));
      fetch('http://30.5.157.206:3000/legao/save.json', {
        method: 'POST',
        body: JSON.stringify(designer.schema),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        mode: 'cors',
      })
        .then((res) => res.json())
        .then(() => {
          window.open('http://30.5.157.206:3333/', 'preview');
        });
    }
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
