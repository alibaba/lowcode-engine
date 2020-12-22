import * as utils from '@ali/ve-utils';
import Popup from '@ali/ve-popups';
import Icons from '@ali/ve-icons';
import logger from '@ali/vu-logger';
import { render } from 'react-dom';
import I18nUtil from './i18n-util';
import { hotkey as Hotkey, monitor } from '@ali/lowcode-editor-core';
import {
  registerMetadataTransducer,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
  modifyBuiltinComponentAction,
} from '@ali/lowcode-designer';
import { createElement } from 'react';
import { VE_EVENTS as EVENTS, VE_HOOKS as HOOKS, VERSION as Version } from './base/const';
import Bus from './bus';
import { skeleton, designer, editor } from './editor';
import { Workbench } from '@ali/lowcode-editor-skeleton';
import Panes from './panes';
import Exchange from './exchange';
import context from './context';
import VisualManager from './base/visualManager';
import VisualDesigner from './base/visualDesigner';
import Trunk from './bundle/trunk';
import Prototype from './bundle/prototype';
import Bundle from './bundle/bundle';
import Pages from './pages';
import * as Field from './fields';
import Prop from './prop';
import Env from './env';
import DragEngine from './drag-engine';
// import Flags from './base/flags';
import Viewport from './viewport';
import Project from './project';
import Symbols from './symbols';
import '@ali/lowcode-editor-setters';

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
      className: 'engine-main',
      topAreaItemClassName: 'engine-actionitem',
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
  VisualDesigner,
  I18nUtil,
  Prop,
};

const designerHelper = {
  registerMetadataTransducer,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
  // modifyBuiltinComponentAction,
};

const VisualEngine = {
  designer,
  designerHelper,
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
  monitor,
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
  Viewport,
  Version,
  Project,
  logger,
  Symbols,
  registerMetadataTransducer,
  // Flags,
};

(window as any).VisualEngine = VisualEngine;

export default VisualEngine;

export {
  designer,
  designerHelper,
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
  monitor,
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
  Viewport,
  Version,
  Project,
  logger,
  Symbols,
  registerMetadataTransducer,
};

const version = '6.0.0 (LowcodeEngine 0.9.32)';

console.log(
  `%c VisionEngine %c v${version} `,
  'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
  'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
);
