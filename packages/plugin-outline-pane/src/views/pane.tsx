import React, { Component } from 'react';
import { observer, globalContext } from '@ali/lowcode-editor-core';
import { intl } from '../locale';
import { OutlineMain } from '../main';
import TreeView from './tree';
import './style.less';
import { IEditor } from '@ali/lowcode-types';

@observer
export class OutlinePane extends Component<{ config: any; editor: IEditor }> {
  private main = new OutlineMain(globalContext.get('editor'), this.props.config.name || this.props.config.pluginKey);

  componentWillUnmount() {
    this.main.purge();
  }

  render() {
    const tree = this.main.currentTree;

    if (!tree) {
      return (
        <div className="lc-outline-pane">
          <p className="lc-outline-notice">{intl('Initializing')}</p>
        </div>
      );
    }

    return (
      <div className="lc-outline-pane">
        <div ref={(shell) => this.main.mount(shell)} className="lc-outline-tree-container">
          <TreeView key={tree.id} tree={tree} />
        </div>
      </div>
    );
  }
}
