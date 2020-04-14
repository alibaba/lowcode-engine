import * as utils from '@ali/ve-utils';
import Popup from '@ali/ve-popups';
import Icons from '@ali/ve-icons';
import { render } from 'react-dom';
import { createElement } from 'react';
import { VE_EVENTS as EVENTS, VE_HOOKS as HOOKS } from './const';
import Bus from './bus';
import Symbols from './symbols';
import Skeleton from '@ali/lowcode-editor-skeleton';
import editor from './editor';
import Exchange from './exchange';

import VisualManager from './base/visualManager';

function init(container?: Element) {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'engine';

  render(
    createElement(Skeleton, {
      editor,
    }),
    container,
  );
}

const ui = {
  Icon: Icons,
  Icons,
  Popup,
};

const modules = {
  VisualManager,
};

export {
  /**
   * VE.Popup
   */
  Popup,
  /**
   * VE Utils
   */
  utils,
  /* pub/sub 集线器 */
  Bus,
  /* 事件 */
  EVENTS,
  /* 修饰方法 */
  HOOKS,
  /* Symbol 管理类 */
  Symbols,
  Exchange,
  /**
   * VE.init
   *
   * Initialized the whole VisualEngine UI
   */
  init,
  ui,
  modules,
};
