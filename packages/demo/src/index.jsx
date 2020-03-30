import React from 'react';
import ReactDOM from 'react-dom';
import Skeleton from '@ali/lowcode-editor-skeleton';
import { registerSetters } from '@ali/lowcode-setters';
import config from './designer/config/skeleton';
import components from './designer/config/components';
import utils from './designer/config/utils';

import './global.scss';
import './designer/config/theme.scss';

registerSetters();

const LCE_CONTAINER = document.getElementById('lce-container');

if (!LCE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="lce-container"></div> 节点.');
}

// @ts-ignore
ReactDOM.render(<Skeleton config={config} utils={utils} components={components} />, LCE_CONTAINER);
