import React, { PureComponent } from 'react';
import { Tab } from '@alifd/next';
import './index.scss';

export default class RightArea extends PureComponent {
  static displayName = 'lowcodeRightArea';

  constructor(props) {
    super(props);
    this.editor = props.editor;
    this.state = {
      activeKey: 'rightPanel1',
    };
  }

  handleTabChange = key => {
    this.setState({
      activeKey: key,
    });
  };

  render() {
    const list =
      (this.editor &&
        this.editor.config &&
        this.editor.config.plugins &&
        this.editor.config.plugins.rightArea) ||
      [];
    return (
      <div className="lowcode-right-area">
        <Tab
          shape="wrapped"
          className="right-tabs"
          style={{
            height: '100%',
          }}
          activeKey={this.state.activeKey}
          lazyLoad={false}
          onChange={this.handleTabChange}
        >
          {list.map((item, idx) => {
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
