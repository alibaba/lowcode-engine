/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { Button } from '@alifd/next';
import { PluginProps, NpmInfo } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';
import streamSaver from 'streamsaver';

import './codeout.scss';

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

const CODEOUT_SERVICE_HOST = 'localhost:7002';

const Codeout = ({ editor }: PluginProps) => {
  const handleClick = () => {
    const designer = editor.get(Designer);
    if (designer) {
      const assets = editor.get('assets') as { components: BasicSection[] };
      const components = assets.components;

      const componentsMap = components
        .filter((c) => !!c.npm)
        .map((c) => ({
          componentName: c.componentName,
          ...(c.npm || {}),
        }));

      const fullSchema = {
        config: {
          historyMode: 'hash',
          targetRootID: 'J_Container',
        },
        meta: {
          name: 'demoproject',
        },
        componentsMap,
        componentsTree: [designer.schema.componentsTree[designer.schema.componentsTree.length - 1]],
      };

      console.info('codeout schema:', fullSchema);
      fetch(`http://${CODEOUT_SERVICE_HOST}/api/generate/project`, {
        method: 'POST',
        body: JSON.stringify({ schema: JSON.stringify(fullSchema) }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        mode: 'cors',
      }).then((res) => {
        const fileStream = streamSaver.createWriteStream('demoProject.zip');
        if (res.body !== null) {
          res.body.pipeTo(fileStream).then(
            () => {
              console.log('success');
            },
            (err) => {
              console.log(err);
            },
          );
        }
      });
    }
  };

  return (
    <div className="lowcode-plugin-codeout">
      <Button type="primary" onClick={handleClick}>
        出码
      </Button>
    </div>
  );
};

export default Codeout;
