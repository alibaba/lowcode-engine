import * as utils from '@ali/ve-utils';
import Popup from '@ali/ve-popups';
import Icons from '@ali/ve-icons';
import { render } from 'react-dom';
import I18nUtil from '@ali/ve-i18n-util';
import { hotkey as Hotkey } from '@ali/lowcode-globals';
import { createElement } from 'react';
import { VE_EVENTS as EVENTS, VE_HOOKS as HOOKS } from './const';
import Bus from './bus';
import Symbols from './symbols';
import { skeleton, editor } from './editor';
import { VisionWorkbench } from './skeleton/workbench';
import Panes from './panes';
import Exchange from './exchange';
import VisualEngineContext from './context';
import VisualManager from './base/visualManager';
import Trunk from './bundle/trunk';
import Prototype from './bundle/prototype';
import Bundle from './bundle/bundle';
import Pages from './pages';
import Field from './field';
import Prop from './prop';
import Env from './env';
import './vision.less';
import DragEngine from './drag-engine';

function init(container?: Element) {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'engine';

  render(
    createElement(VisionWorkbench, {
      skeleton,
    }),
    container,
  );
}

/**
 * VE.ui.xxx
 *
 * Core UI Components
 */
const ui = {
  Field,
  Icon: Icons,
  Icons,
  Popup,
};

const modules = {
  VisualManager,
  I18nUtil,
  Prop,
};

const context = new VisualEngineContext();

const VisualEngine = {
  editor,
  /**
   * VE.Popup
   */
  Popup,
  /**
   * VE Utils
   */
  utils,
  I18nUtil,
  Hotkey,
  Env,
  /* pub/sub 集线器 */
  Bus,
  /* 事件 */
  EVENTS,
  /* 修饰方法 */
  HOOKS,
  /* Symbol 管理类 */
  Symbols,
  Exchange,
  context,
  /**
   * VE.init
   *
   * Initialized the whole VisualEngine UI
   */
  init,
  ui,
  Panes,
  modules,
  Trunk,
  Prototype,
  Bundle,
  Pages,
  DragEngine,
};

export default VisualEngine;

(window as any).VisualEngine = VisualEngine;

/*
console.log(
  `%cLowcodeEngine %cv${VERSION}`,
  "color:#000;font-weight:bold;",
  "color:green;font-weight:bold;"
);
*/
