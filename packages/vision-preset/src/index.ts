import * as utils from '@ali/ve-utils';
import Popup from '@ali/ve-popups';
import Icons from '@ali/ve-icons';
import { render } from 'react-dom';
import I18nUtil from '@ali/ve-i18n-util';
import { hotkey as Hotkey } from '@ali/lowcode-editor-core';
import { createElement } from 'react';
import { VE_EVENTS as EVENTS, VE_HOOKS as HOOKS } from './base/const';
import Bus from './bus';
import { skeleton } from './editor';
import { Workbench } from '@ali/lowcode-editor-skeleton';
import Panes from './panes';
import Exchange from './exchange';
import context from './context';
import VisualManager from './base/visualManager';
import Trunk from './bundle/trunk';
import Prototype from './bundle/prototype';
import Bundle from './bundle/bundle';
import Pages from './pages';
import * as Field from './fields';
import Prop from './prop';
import Env from './env';
import DragEngine from './drag-engine';
import { designer, editor } from './editor';

import './vision.less';

function init(container?: Element) {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'engine';

  render(
    createElement(Workbench, {
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

const VisualEngine = {
  designer,
  editor,
  skeleton,
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

(window as any).VisualEngine = VisualEngine;

export default VisualEngine;

export {
  designer,
  editor,
  skeleton,
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


/*
console.log(
  `%cLowcodeEngine %cv${VERSION}`,
  "color:#000;font-weight:bold;",
  "color:green;font-weight:bold;"
);
*/
