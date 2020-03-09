import React, { PureComponent } from 'react';

import Editor from '../../../framework/editor';
import { PluginConfig } from '../../../framework/definitions';
import './index.scss';

export interface CenterAreaProps {
  editor: Editor;
}

export default class CenterArea extends PureComponent<CenterAreaProps> {
  static displayName = 'LowcodeCenterArea';

  private editor: Editor;
  private config: Array<PluginConfig>;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config = (this.editor.config && this.editor.config.plugins && this.editor.config.plugins.centerArea) || [];
  }

  render() {
    return (
      <div className="lowcode-center-area">
        {this.config.map(item => {
          const Comp = this.editor.components[item.pluginKey];
          return <Comp editor={this.editor} config={item} {...item.pluginProps} />;
        })}
      </div>
    );
  }
}
