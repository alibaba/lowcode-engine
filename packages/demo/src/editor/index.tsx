import { render } from 'react-dom';
import GeneralWorkbench from '@ali/lowcode-editor-preset-general';
import config from './config';
import components from './components';
import './global.scss';

const LCE_CONTAINER = document.getElementById('lce-container');

render(<GeneralWorkbench config={config} components={components} />, LCE_CONTAINER);
