import React, { Component } from 'react';
import { observer, globalContext } from '@alilc/lowcode-editor-core';
import { intl } from '../locale';
import { OutlineMain } from '../main';
import TreeView from './tree';
import './style.less';
import { IEditor } from '@alilc/lowcode-types';
import Filter from './filter';
import { registerTreeTitleExtra } from '../helper/tree-title-extra';

interface Props { config: any; editor: IEditor }
@observer
export class OutlinePane extends Component<any> {
  private main;

  constructor(props: Props) {
    super(props);
    this.main = new OutlineMain(this.props.engineEditor, this.props.config.name || this.props.config.pluginKey);
  }

  componentWillUnmount() {
    this.main.purge();
  }

  componentDidMount() {
    registerTreeTitleExtra(this.props?.config?.contentProps?.treeTitleExtra);
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
        <Filter tree={tree} />
        <div ref={(shell) => this.main.mount(shell)} className="lc-outline-tree-container">
          <TreeView key={tree.id} tree={tree} />
        </div>
      </div>
    );
  }
}
