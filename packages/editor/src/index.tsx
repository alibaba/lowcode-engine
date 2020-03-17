import React from 'react';
import ReactDOM from 'react-dom';
// import Skeleton from '@ali/lowcode-engine-skeleton';
import { HashRouter as Router, Route } from 'react-router-dom';
import Skeleton from './skeleton';
import config from './config/skeleton';
import components from './config/components';
import utils from './config/utils';
import constants from './config/constants';
import './config/locale';
import './config/setters';

import './global.scss';
import './config/theme.scss';

const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

ReactDOM.render(
  <Router>
    <Route
      path="/*"
      component={(props): React.ReactNode => (
        <Skeleton
          {...props}
          {...(config.skeleton && config.skeleton.props)}
          config={config}
          utils={utils}
          constants={constants}
          components={components}
        />
      )}
    />
  </Router>,
  ICE_CONTAINER
);
