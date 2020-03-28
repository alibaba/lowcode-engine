import React, { Component } from 'react';
import { observer } from '@ali/lowcode-globals';
import { intl } from '../locale';
import { OutlineMain } from '../main';
import TreeView from './tree';
import './style.less';

@observer
export default class OutlinePane extends Component<{ editor: any }> {
  private main = new OutlineMain(this.props.editor);

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.main.purge();
  }

  render() {
    const tree = this.main.currentTree;

    console.info('tree', tree);

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
