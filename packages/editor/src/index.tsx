import React from 'react';
import ReactDOM from 'react-dom';
// import Skeleton from '@ali/lowcode-engine-skeleton';
import Skeleton from './skeleton';
import config from './config/skeleton';
import components from './config/components';
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
  <Skeleton
    {...(config.skeleton && config.skeleton.props)}
    config={config}
    utils={utils}
    constants={constants}
    components={components}
  />,
  ICE_CONTAINER
);
