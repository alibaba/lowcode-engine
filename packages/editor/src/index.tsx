import React from 'react';
import ReactDOM from 'react-dom';
import Skeleton from '@ali/lowcode-editor-skeleton';
import config from './config/skeleton';
import components from './config/components';
import utils from './config/utils';
import './config/locale';
import './config/setters';

import './global.scss';
import './config/theme.scss';

const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

ReactDOM.render(<Skeleton config={config} utils={utils} components={components}/>,
  ICE_CONTAINER
);
