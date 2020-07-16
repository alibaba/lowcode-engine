/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { Button } from '@alifd/next';
import { PluginProps } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';
import streamSaver from 'streamsaver';

import './codeout.scss';

const CODEOUT_SERVICE_HOST = '30.8.52.239:3000';

const Codeout = ({ editor }: PluginProps) => {
  const handleClick = () => {
    const designer = editor.get(Designer);
    if (designer) {
      const fullSchema = {
        ...designer.schema,
        config: {
          historyMode: 'hash',
          targetRootID: 'J_Container',
        },
        meta: {
          name: 'demoproject',
        },
      };

      console.info('codeout schema:', fullSchema);
      // localStorage.setItem('lce-dev-store', JSON.stringify(designer.schema));
      fetch(`http://${CODEOUT_SERVICE_HOST}/api/generate/project`, {
        method: 'POST',
        body: JSON.stringify({ schema: JSON.stringify(fullSchema) }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        mode: 'cors',
      }).then((res) => {
        console.log(res);

        const fileStream = streamSaver.createWriteStream('demoProject.zip');
        res.body.pipeTo(fileStream).then(
          () => {
            console.log('success');
          },
          (err) => {
            console.log(err);
          },
        );
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
