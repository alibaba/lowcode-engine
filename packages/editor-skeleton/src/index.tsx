import React, { PureComponent } from 'react';

// import Editor from '@ali/lowcode-engine-editor';
import { Loading, ConfigProvider } from '@alifd/next';
import defaultConfig from './config/skeleton';

import TopArea from './layouts/TopArea';
import LeftArea from './layouts/LeftArea';
import CenterArea from './layouts/CenterArea';
import RightArea from './layouts/RightArea';

import './global.scss';

export default class Skeleton extends PureComponent {
  static displayName = 'lowcodeEditorSkeleton';

  constructor(props) {
    super(props);
    // this.editor = new Editor(props.config, props.utils);
    this.editor = {
      on: () => {},
      off: () => {},
      config: props.config,
      pluginComponents: props.pluginComponents
    };
  }

  componentWillUnmount() {
    // this.editor && this.editor.destroy();
    // this.editor = null;
  }

  render() {
    const { location, history, messages } = this.props;
    this.editor.location = location;
    this.editor.history = history;
    this.editor.messages = messages;
    return (
      <ConfigProvider>
        <Loading
          tip="Loading"
          size="large"
          visible={false}
          shape="fusion-reactor"
          fullScreen
        >
          <div className="lowcode-editor">
            <TopArea editor={this.editor}/>
            <div className="lowcode-main-content">
              <LeftArea.Nav editor={this.editor}/>
              <LeftArea.Panel editor={this.editor}/>
              <CenterArea editor={this.editor}/>
              <RightArea editor={this.editor}/>
            </div>
          </div>
        </Loading>
      </ConfigProvider>
    );
  }
}
