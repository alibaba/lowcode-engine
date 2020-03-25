import React, { PureComponent } from 'react';

import { Loading, ConfigProvider } from '@alifd/next';
import { HashRouter as Router, Route } from 'react-router-dom';
import Editor, { utils } from '@ali/lowcode-editor-framework';
import {
  EditorConfig,
  Utils,
  PluginClassSet,
} from '@ali/lowcode-editor-framework/lib/definitions';
import defaultConfig from './config/skeleton';
import skeletonUtils from './config/utils';

import TopArea from './layouts/TopArea';
import LeftArea from './layouts/LeftArea';
import CenterArea from './layouts/CenterArea';
import RightArea from './layouts/RightArea';
import './global.scss';

const { comboEditorConfig, parseSearch } = utils;

let renderIdx = 0;

declare global {
  interface Window {
    __ctx: {
      editor: Editor;
      appHelper: Editor;
    };
  }
}

export interface SkeletonProps {
  components: PluginClassSet;
  config: EditorConfig;
  history: object;
  location: object;
  match: object;
  utils: Utils;
}

export interface SkeletonState {
  initReady?: boolean;
  skeletonKey?: string;
  __hasError?: boolean;
}

export class Skeleton extends PureComponent<SkeletonProps, SkeletonState> {
  static displayName = 'LowcodeEditorSkeleton';

  static getDerivedStateFromError(): SkeletonState {
    return {
      __hasError: true,
    };
  }

  private editor: Editor;

  constructor(props) {
    super(props);

    this.state = {
      initReady: false,
      skeletonKey: `skeleton${renderIdx}`,
    };

    this.init();
  }

  componentWillUnmount(): void {
    this.editor && this.editor.destroy();
  }

  componentDidCatch(err): void {
    console.error(err);
  }

  init = (isReset: boolean = false): void => {
    if (this.editor) {
      this.editor.destroy();
    }
    const { utils, config, components } = this.props;
    const editor = new Editor(
      comboEditorConfig(defaultConfig, config),
      components,
      {
        ...skeletonUtils,
        ...utils,
      },
    );
    this.editor = editor;
    // eslint-disable-next-line no-underscore-dangle
    window.__ctx = {
      editor,
      appHelper: editor,
    };
    editor.once('editor.reset', (): void => {
      this.setState({
        initReady: false,
      });
      editor.emit('editor.beforeReset');
      this.init(true);
    });

    this.editor.init().then((): void => {
      this.setState(
        {
          initReady: true,
          // 刷新IDE时生成新的skeletonKey保证插件生命周期重新执行
          skeletonKey: isReset
            ? `skeleton${++renderIdx}`
            : this.state.skeletonKey,
        },
        (): void => {
          editor.emit('editor.ready');
          editor.emit('ide.ready');
          isReset && editor.emit('ide.afterReset');
        },
      );
    });
  };

  render(): React.ReactNode {
    const { initReady, skeletonKey, __hasError } = this.state;
    const { location, history, match } = this.props;
    if (__hasError || !this.editor) {
      return 'error';
    }

    location.query = parseSearch(location.search);
    this.editor.set('location', location);
    this.editor.set('history', history);
    this.editor.set('match', match);

    return (
      <ConfigProvider>
        <Loading tip="Loading" size="large" visible={!initReady} fullScreen>
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
  }
}

// 通过React-Router包裹，支持编辑器内页面根据路由切换
export interface SkeletonWithRouterProps {
  components: PluginClassSet;
  config: EditorConfig;
  utils: Utils;
}

const SkeletonWithRouter: React.FC<SkeletonWithRouterProps> = (
  props,
): React.ReactElement => {
  const { config, ...otherProps } = props;
  return (
    <Router>
      <Route
        path="/*"
        component={routerProps => (
          <Skeleton
            {...routerProps}
            {...otherProps}
            {...(config.skeleton && config.skeleton.props)}
            config={config}
          />
        )}
      />
    </Router>
  );
};

export default SkeletonWithRouter;
