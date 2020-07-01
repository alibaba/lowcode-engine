import { render } from 'react-dom';
import GeneralWorkbench, { editor } from '../../../editor-preset-general/src';
import config from './config';
import components from './components';
import './global.scss';

const LCE_CONTAINER = document.getElementById('lce-container');

render(<GeneralWorkbench config={config} components={components} />, LCE_CONTAINER);
