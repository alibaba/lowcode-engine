import React from 'react';
import ReactDOM from 'react-dom';
import { registerSetters } from '@ali/lowcode-setters';
import config from './config/skeleton';
import components from './config/components';
import utils from './config/utils';

import './global.scss';
import './config/theme.scss';

registerSetters();
const Skeleton = components.LowcodeSkeleton;
const LCE_CONTAINER = document.getElementById('lce-container');

console.info('aeafeawef')
if (!LCE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="lce-container"></div> 节点.');
}

// @ts-ignore
ReactDOM.render(<Skeleton config={config} utils={utils} components={components} />, LCE_CONTAINER);
