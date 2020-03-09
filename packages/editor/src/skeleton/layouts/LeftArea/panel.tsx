import React, { PureComponent, Fragment } from 'react';
import Panel from '../../components/Panel';
import './index.scss';
import Editor from '../../../framework/editor';
import { PluginConfig } from '../../../framework/definitions';

export interface LeftAreaPanelProps {
  editor: Editor;
}

export interface LeftAreaPanelState {
  activeKey: string;
}

export default class LeftAreaPanel extends PureComponent<LeftAreaPanelProps, LeftAreaPanelState> {
  static displayName = 'LowcodeLeftAreaPanel';

  private editor: Editor;
  private config: Array<PluginConfig>;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config = (this.editor.config.plugins && this.editor.config.plugins.leftArea) || [];

    this.state = {
      activeKey: 'leftPanelIcon'
    };
  }

  render() {
    const list = this.config.filter(item => {
      return item.type === 'PanelIcon';
    });
    return (
      <Fragment>
        {list.map((item, idx) => {
          const Comp = this.editor.components[item.pluginKey];
          return (
            <Panel key={item.pluginKey} visible={item.pluginKey === this.state.activeKey}>
              <Comp editor={this.editor} config={item} />
            </Panel>
          );
        })}
      </Fragment>
    );
  }
}
