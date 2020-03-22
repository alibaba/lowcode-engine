import React, { Component } from 'react';
import { OutlineMain } from '../main';
import { intl } from '../locale';
import { observer } from '../../../globals/src';
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
    if (!this.main.master) {
      return (
        <div className="lc-outline-pane">
          <p className="lc-outline-notice">{intl('Designer not found')}</p>
        </div>
      );
    }

    if (!this.main.master.currentTree) {
      return (
        <div className="lc-outline-pane">
          <p className="lc-outline-notice">{intl('No opened document')}</p>
        </div>
      );
    }

    return (
      <div className="lc-outline-pane">
        <div
          ref={shell => this.main.mount(shell)}
          className="lc-outline-tree-container"
        >
          <TreeView tree={this.main.master.currentTree} />
        </div>
      </div>
    );
  }
}
