import React, { useState } from 'react';
import './index.scss';
import Editor from '../../framework/index';
import { PluginConfig } from '../../framework/definitions';
import TopIcon from '../../skeleton/components/TopIcon/index';

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
  logo?: string;
}

export default function(props: PluginProps) {
  const [backEnable, setBackEnable] = useState(true);
  const [forwardEnable, setForwardEnable] = useState(true);
  return (
    <div className="lowcode-plugin-undo-redo">
      <TopIcon icon="houtui" title="后退" disabled={!backEnable} />
      <TopIcon icon="qianjin" title="前进" disabled={!forwardEnable} />
    </div>
  );
}
