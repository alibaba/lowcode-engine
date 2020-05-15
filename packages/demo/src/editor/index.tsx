import { render } from 'react-dom';
import GeneralWorkbench from '@ali/lowcode-editor-preset-general';
import config from './config';
import components from './components';
import './global.scss';

const LCE_CONTAINER = document.getElementById('lce-container');

if (!LCE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="lce-container"></div> 节点.');
}

render(<GeneralWorkbench config={config} components={components} />, LCE_CONTAINER);
