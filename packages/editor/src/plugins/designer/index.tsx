import React, { PureComponent } from 'react';

import Editor from '../../framework/index';
import { PluginConfig } from '../../framework/definitions';

import './index.scss';

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
}

export default class DesignerPlugin extends PureComponent<PluginProps> {
  static displayName: 'LowcodePluginDesigner';

  constructor(props) {}

  render() {}
}
