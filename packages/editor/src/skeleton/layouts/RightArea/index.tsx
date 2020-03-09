import React, { PureComponent } from 'react';
import { Tab } from '@alifd/next';
import './index.scss';
import Editor from '../../../framework/editor';
import { PluginConfig } from '../../../framework/definitions';

export interface RightAreaProps {
  editor: Editor;
}

export interface RightAreaState {
  activeKey: string;
}

export default class RightArea extends PureComponent<RightAreaProps, RightAreaState> {
  static displayName = 'LowcodeRightArea';

  private editor: Editor;
  private config: Array<PluginConfig>;

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.config = (this.editor.config.plugins && this.editor.config.plugins.rightArea) || [];
    this.state = {
      activeKey: 'rightPanel1'
    };
  }

  handleTabChange = (key: string): void => {
    this.setState({
      activeKey: key
    });
  };

  render() {
    return (
      <div className="lowcode-right-area">
        <Tab
          shape="wrapped"
          className="right-tabs"
          style={{
            height: '100%'
          }}
          activeKey={this.state.activeKey}
          lazyLoad={false}
          onChange={this.handleTabChange}
        >
          {this.config.map((item, idx) => {
            const Comp = this.editor.components[item.pluginKey];
            return (
              <Tab.Item key={item.pluginKey} title={item.props.title}>
                <Comp editor={this.editor} config={item.config} {...item.pluginProps} />
              </Tab.Item>
            );
          })}
        </Tab>
      </div>
    );
  }
}
