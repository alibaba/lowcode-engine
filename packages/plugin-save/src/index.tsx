import React from 'react';
import { Button } from '@alifd/next';
import './index.scss';
import { PluginProps } from '@ali/lowcode-editor-core/lib/definitions';

const Save: React.FC<PluginProps> = (props): React.ReactElement => {
  const handleClick = (): void => {
    console.log('save data:', props.editor.designer.currentDocument.schema);
    console.log('save data json:', JSON.stringify(props.editor.designer.currentDocument.schema));
  };

  return (
    <div className="lowcode-plugin-save">
      <Button type="primary" onClick={handleClick}>
        保存
      </Button>
    </div>
  );
};

export default Save;
