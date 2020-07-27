/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { Button } from '@alifd/next';
import { PluginProps, NpmInfo } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';

import './saveload.scss';

interface BasicSection {
  componentName: string;
  title: string;
  description?: string;
  docUrl?: string;
  screenshot?: string;
  icon?: string;
  tags?: string[];
  devMode?: 'proCode' | 'lowCode';
  npm: NpmInfo;
  [k: string]: any;
}

const Codeout = ({ editor }: PluginProps) => {
  const handleSaveClick = () => {
    const designer = editor.get(Designer);
    if (designer) {
      const schema = designer.schema.componentsTree[0]; // editor.get('schema');
      const schemaStr = JSON.stringify(schema);
      window.localStorage.setItem('schema_data', schemaStr);
      console.info('save schema:', schemaStr);
      alert('保存成功');
    }
  };

  const handleLoadClick = () => {
    const designer = editor.get(Designer);
    if (designer) {
      const tmp = window.localStorage.getItem('schema_data');
      if (tmp) {
        try {
          const schema = JSON.parse(tmp);
          editor.set('schema', schema);
          console.info('load schema:', schema);
          alert('加载成功');
        } catch (error) {
          console.log('Invalid Schema', error);
        }
      }
    }
  };

  return (
    <React.Fragment>
      <div className="lowcode-plugin-saveload">
        <Button type="primary" onClick={handleSaveClick}>
          保存
        </Button>
      </div>
      <div className="lowcode-plugin-saveload">
        <Button type="primary" onClick={handleLoadClick}>
          加载
        </Button>
      </div>
    </React.Fragment>
  );
};

export default Codeout;
