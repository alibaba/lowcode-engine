import React, { PureComponent } from 'react';

import './index.scss';

export default class CenterArea extends PureComponent {
  static displayName = 'lowcodeCenterArea';

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config = this.editor.config && this.editor.config.plugins && this.editor.config.plugins.centerArea || [];
  }

  render() {
     const list = this.config.filter(item => {
        return true;
      });
    return (
      <div className="lowcode-center-area">
        {list.map(item => {
          const Comp = this.editor.components[item.pluginKey];
          return (
            <Comp
              editor={this.editor}
              config={item}
              {...item.pluginProps}
            />
          )
        })}
      </div>
    );
  }
}
