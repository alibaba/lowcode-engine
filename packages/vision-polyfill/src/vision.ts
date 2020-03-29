import * as utils from '@ali/ve-utils';
import popups from '@ali/ve-popups';
import Icons from '@ali/ve-icons';
import { VE_EVENTS, VE_HOOKS } from './const';
import Bus from './bus';
import Symbols from './symbols';

const VEOldAPIs = {
  /**
   * VE.Popup
   */
  Popup: popups,
  /**
   * VE.ui.xxx
   *
   * Core UI Components
   */
  ui: {
    Field: {
      SettingField,
      Stage,
      CaptionField,
      PopupField,
      EntryField,
      AccordionField,
      BlockField,
      InlineField,
      PlainField
    },
    Icon: Icons,
    Icons,
    Popup: popups,
    /*
    // for rax visualpage, will not support any
    FaultComponent,
    HiddenComponent,
    UnknownComponent,
    InsertionGhost,
    */
  },

  /**
   * VE.context DI 实现
   *
   * 默认未初始化，需要等待 init 之后
   */
  context: new VisualEngineContext(),

  /**
   * VE.init
   *
   * Initialized the whole VisualEngine UI
   */
  init: once((container?: Element, contextConfigs?: any) => {
    if (!container) {
      container = document.createElement('div');
      document.body.appendChild(container);
    }
    container.id = 'engine';
    ReactDOM.render(<Editor />, container);
  }),

  /**
   * VE.modules.xxx
   *
   * VE BuildIn Modules
   */
  modules: {
    // SchemaManager, 没看到使用的地方
    // VisualDesigner, 没看到使用的地方
    VisualManager // legao-designer 有用
    // VisualRender, 没看到使用的地方
    I18nUtil, // vs-list vs-rhino-widget-mapping
    Prop, // vs-list vs-rhino-widget-mapping
    /* 没看到使用的地方
    Node,
    Props,

    Scroller,
    Insertion,
    */
  },

  /**
   * VE Utils
   */
  utils,
  /* 包抽象 */
  Bundle,

  /* pub/sub 集线器 */
  // ve-quick-search-pane, ve-section-pane vp-in-place-editing ve-action-save
  // ve-page-history vs-q-chart-data ve-action-pane ve-page-lock-pane
  // ve-datapool-pane ve-youshu-card-param-pane
  Bus,

  /* 拖拽引擎 */
  DragEngine, //  在 ve-metadata-pane, ve-section-pane， ve-trunk-pane-simple， ve-trunk-pane 中有用

  /* 环境变量 */
  // vu-oneapi-parser vu-events-property ve-section-pane vs-formula vu-link-property
  // ve-datapool-pane  vs-form-validator vs-style vs-link vs-micro-link vs-link-options vu-field-property
  Env,

  /* 状态交换 */
  //
  Exchange,

  /* 状态 Flags */
  // legao-design tree-pane
  Flags,

  /* 快捷键 */
  // legao-design
  Hotkey,

  /* 多语言文案 */
  I18nUtil,

  /* 页面管理 */
  Pages,

  /* 面板管理 */
  Panes,

  /* 应用管理 */
  Project,

  /* 包原型 */
  Prototype,

  /* 组件仓库 */
  Trunk,

  /* 事件 */
  EVENTS: VE_EVENTS, // legao-design

  /* 修饰方法 */
  HOOKS: VE_HOOKS, // legao-design vu-visualpage-rax

  /* 视图管理 */
  Viewport,

  /* Symbol 管理类 */
  Symbols, // legao-design vu-action-util

  /**
   * VisualEngine Logger Tool
   */
  // lg: logger, 没看到使用的地方
  // logger,

  /* 版本号 */
  // Version: VERSION,

  // Location,
  // Node,
  // VirtualRenderingNode
}
