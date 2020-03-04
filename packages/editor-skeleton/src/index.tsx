import React, {PureComponent} from 'react-dom';

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
  }

  componentWillUnmount() {
    // this.editor && this.editor.destroy();
    // this.editor = null;
  }

  render() {
    const { location, history, messages } = this.props;
    
    return (
      <ConfigProvider locale={messages[appHelper.locale]}>
        <Loading
          tip={this.i18n('loading')}
          size="large"
          visible={loading || !initReady}
          shape="fusion-reactor"
          fullScreen
        >
          <div className="lowcode-editor">
            {/* <TopArea/>
            <div className="lowcode-main-content">
              <LeftArea.Nav/>
              <LeftArea.Panel/>
              <CenterArea/>
              <RightArea/>
            </div> */}
          </div>
        </Loading>
      </ConfigProvider>
    );
  }
}
