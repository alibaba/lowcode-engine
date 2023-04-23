import React, { PureComponent } from 'react';
import { Loading } from '@alifd/next';
import { PaneController } from '../controllers/pane-controller';
import TreeView from './tree';
import './style.less';
import Filter from './filter';
import { TreeMaster } from '../controllers/tree-master';
import { Tree } from '../controllers/tree';
import { IPublicTypeDisposable } from '@alilc/lowcode-types';

export class Pane extends PureComponent<{
  config: any;
  treeMaster: TreeMaster;
  controller: PaneController;
}, {
  tree: Tree | null;
}> {
  private controller;

  private dispose: IPublicTypeDisposable;

  constructor(props: any) {
    super(props);
    const { controller, treeMaster } = props;
    this.controller = controller;
    this.state = {
      tree: treeMaster.currentTree,
    };
  }

  componentWillUnmount() {
    this.controller.purge();
    this.dispose && this.dispose();
  }

  componentDidMount() {
    this.dispose = this.props.treeMaster.pluginContext.project.onSimulatorRendererReady(() => {
      this.setState({
        tree: this.props.treeMaster.currentTree,
      });
    });
  }

  render() {
    const tree = this.state.tree;

    if (!tree) {
      return (
        <div className="lc-outline-pane">
          <p className="lc-outline-notice">
            {/* @ts-ignore */}
            <Loading
              style={{
                display: 'block',
                marginTop: '40px',
              }}
              tip={this.props.treeMaster.pluginContext.intl('Initializing')}
            />
          </p>
        </div>
      );
    }

    return (
      <div className="lc-outline-pane">
        <Filter tree={tree} />
        <div ref={(shell) => this.controller.mount(shell)} className="lc-outline-tree-container">
          <TreeView key={tree.id} tree={tree} />
        </div>
      </div>
    );
  }
}
