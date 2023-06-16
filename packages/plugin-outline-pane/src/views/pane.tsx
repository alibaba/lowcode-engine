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
  treeMaster: TreeMaster;
  controller: PaneController;
  hideFilter?: boolean;
}, {
  tree: Tree | null;
}> {
  private controller;

  private simulatorRendererReadyDispose: IPublicTypeDisposable;
  private changeDocumentDispose: IPublicTypeDisposable;
  private removeDocumentDispose: IPublicTypeDisposable;

  constructor(props: any) {
    super(props);
    const { controller, treeMaster } = props;
    this.controller = controller;
    this.state = {
      tree: treeMaster.currentTree,
    };
    this.simulatorRendererReadyDispose = this.props.treeMaster.pluginContext?.project?.onSimulatorRendererReady(this.changeTree);
    this.changeDocumentDispose = this.props.treeMaster.pluginContext?.project?.onChangeDocument(this.changeTree);
    this.removeDocumentDispose = this.props.treeMaster.pluginContext?.project?.onRemoveDocument(this.changeTree);
  }

  changeTree = () => {
    this.setState({
      tree: this.props.treeMaster.currentTree,
    });
  };

  componentWillUnmount() {
    this.controller.purge();
    this.simulatorRendererReadyDispose?.();
    this.changeDocumentDispose?.();
    this.removeDocumentDispose?.();
  }

  render() {
    const tree = this.state.tree;

    if (!tree) {
      return (
        <div className="lc-outline-pane">
          <p className="lc-outline-notice">
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
        { !this.props.hideFilter && <Filter tree={tree} /> }
        <div ref={(shell) => this.controller.mount(shell)} className={`lc-outline-tree-container ${ this.props.hideFilter ? 'lc-hidden-outline-filter' : '' }`}>
          <TreeView key={tree.id} tree={tree} />
        </div>
      </div>
    );
  }
}
