import React from 'react';
import ReactDOM from 'react-dom';
import Skeleton from '@ali/lowcode-editor-skeleton';
import config from './config/skeleton';
import components from './config/components';
import utils from './config/utils';
import '@ali/lowcode-setters';
import './config/locale';

import './global.scss';
import './config/theme.scss';

const LCE_CONTAINER = document.getElementById('lce-container');

if (!LCE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="lce-container"></div> 节点.');
}

ReactDOM.render(<Skeleton config={config} utils={utils} components={components} />, LCE_CONTAINER);
