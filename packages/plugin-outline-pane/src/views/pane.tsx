import React, { PureComponent } from 'react';
import { PaneController } from '../controllers/pane-controller';
import TreeView from './tree';
import './style.less';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import Filter from './filter';
import { TreeMaster } from '../controllers/tree-master';

export class Pane extends PureComponent<{
  config: any;
  pluginContext: IPublicModelPluginContext;
  treeMaster: TreeMaster;
  controller: PaneController;
}> {
  private controller;
  private treeMaster: TreeMaster;

  constructor(props: any) {
    super(props);
    const { controller, treeMaster } = props;
    this.treeMaster = treeMaster;
    this.controller = controller;
  }

  componentWillUnmount() {
    this.controller.purge();
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
        <Filter tree={tree} pluginContext={this.props.pluginContext} />
        <div ref={(shell) => this.controller.mount(shell)} className="lc-outline-tree-container">
          <TreeView key={tree.id} tree={tree} pluginContext={this.props.pluginContext} />
        </div>
      </div>
    );
  }
}
