import React, { PureComponent } from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';
import Editor from '../framework/editor';
import { comboEditorConfig, parseSearch } from '../framework/utils';
import { Loading, ConfigProvider } from '@alifd/next';
import defaultConfig from './config/skeleton';
import skeletonUtils from './config/utils';

import TopArea from './layouts/TopArea';
import LeftArea from './layouts/LeftArea';
import CenterArea from './layouts/CenterArea';
import RightArea from './layouts/RightArea';

import './global.scss';

let renderIdx = 0;

export default class Skeleton extends PureComponent {
  static displayName = 'LowcodeEditorSkeleton';

  static getDerivedStateFromError() {
    return {
      __hasError: true,
    };
  }
  constructor(props) {
    super(props);

    this.state = {
      initReady: false,
      skeletonKey: `skeleton${renderIdx}`,
    };

    this.init();
  }

  componentWillUnmount() {
    this.editor && this.editor.destroy();
    this.editor = null;
  }

  componentDidCatch(err) {
    console.error(err);
  }

  init = (isReset = false) => {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
    const { utils, config, components } = this.props;
    const editor = (this.editor = new Editor(
      comboEditorConfig(defaultConfig, config),
      { ...skeletonUtils, ...utils },
      components,
    ));
    window.__ctx = {
      editor,
      appHelper: editor
    };
    editor.once('editor.reset', () => {
      this.setState({
        initReady: false,
      });
      editor.emit('editor.beforeReset');
      this.init(true);
    });

    this.editor.init().then(() => {
      this.setState(
        {
          initReady: true,
          //刷新IDE时生成新的skeletonKey保证插件生命周期重新执行
          skeletonKey: isReset
            ? `skeleton${++renderIdx}`
            : this.state.skeletonKey, 
        },
        () => {
          editor.emit('editor.ready');
          isReset && editor.emit('ide.afterReset');
        }
      );
    });
  };

  render() {
    const { initReady, skeletonKey, __hasError } = this.state;
    if (__hasError) {
      return 'error';
    }

    return (
      <Router>
        <Route
          path="/*"
          component={props => {
            const { location, history, match } = props;
            location.query = parseSearch(location.search);
            this.editor.set('location', location);
            this.editor.set('history', history);
            this.editor.set('match', match);
            return (
              <ConfigProvider>
                <Loading
                  tip="Loading"
                  size="large"
                  visible={!initReady}
                  shape="fusion-reactor"
                  fullScreen
                >
                  <div className="lowcode-editor" key={skeletonKey}>
                    <TopArea editor={this.editor} />
                    <div className="lowcode-main-content">
                      <LeftArea.Nav editor={this.editor} />
                      <LeftArea.Panel editor={this.editor} />
                      <CenterArea editor={this.editor} />
                      <RightArea editor={this.editor} />
                    </div>
                  </div>
                </Loading>
              </ConfigProvider>
            );
          }}
        />
      </Router>
    );
  }
}
