import React, { Component } from 'react';
import { PaneController } from '../controllers/pane-controller';
import TreeView from './tree';
import './style.less';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import Filter from './filter';
import { registerTreeTitleExtra } from '../helper/tree-title-extra';
import { getTreeMaster, TreeMaster } from '../controllers/tree-master';


export class Pane extends Component<{
  config: any;
  pluginContext: IPublicModelPluginContext;
}> {
  private controller;
  private treeMaster: TreeMaster;

  constructor(props: any) {
    super(props);
    this.treeMaster = getTreeMaster(this.props.pluginContext);
    this.controller = new PaneController(
        this.props.config.name || this.props.config.pluginKey,
        this.props.pluginContext,
        this.treeMaster,
      );
  }

  componentWillUnmount() {
    this.controller.purge();
  }

  componentDidMount() {
    registerTreeTitleExtra(this.props?.config?.contentProps?.treeTitleExtra);
  }

  render() {
    const tree = this.treeMaster.currentTree;

    if (!tree) {
      return (
        <div className="lc-outline-pane">
          <p className="lc-outline-notice">{this.props.pluginContext.intl('Initializing')}</p>
        </div>
      );
    }

    return (
      <div className="lc-outline-pane">
        <Filter tree={tree} />
        <div ref={(shell) => this.controller.mount(shell)} className="lc-outline-tree-container">
          <TreeView key={tree.id} tree={tree} pluginContext={this.props.pluginContext} />
        </div>
      </div>
    );
  }
}
