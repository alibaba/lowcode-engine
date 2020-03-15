import React from 'react';
import './index.scss';
import Editor from '../../framework/index';
import { PluginConfig } from '../../framework/definitions';

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
  logo?: string;
  href?: string;
}

export default function(props: PluginProps) {
  return (
    <div className="lowcode-plugin-logo">
      <a className="logo" target="blank" href={props.href || '/'} style={{ backgroundImage: `url(${props.logo})` }} />
    </div>
  );
}
