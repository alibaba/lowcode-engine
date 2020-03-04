import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import Skeleton from '@ali/lowcode-engine-skeleton';

import config from './config/skeleton';
import components from './config/components';
import componentsMap from './config/componentsMap';
import utils from './config/utils';
import constants from './config/constants';
import messages from './config/locale';

import pkg from '../package.json';
import './global.scss';
import './config/theme.scss';

window.__pkg = pkg;

const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

ReactDOM.render(
  <Router>
    <Route
      path="/*"
      component={props => {
        return (
          <Skeleton
            {...props}
            {...(config.skeleton && config.skeleton.props)}
            config={config}
            utils={utils}
            messages={messages}
            constants={constants}
            pluginComponents={components}
          />
        );
      }}
    />
  </Router>, ICE_CONTAINER);
