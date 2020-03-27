import _extends from "@babel/runtime/helpers/extends";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import Debug from 'debug';
import { EventEmitter } from 'events';
import store from 'store';
import pluginFactory from './pluginFactory';
import * as editorUtils from './utils';
var registShortCuts = editorUtils.registShortCuts,
    transformToPromise = editorUtils.transformToPromise,
    unRegistShortCuts = editorUtils.unRegistShortCuts;
// 根据url参数设置debug选项
var debugRegRes = /_?debug=(.*?)(&|$)/.exec(location.search);

if (debugRegRes && debugRegRes[1]) {
  // eslint-disable-next-line no-underscore-dangle
  window.__isDebug = true;
  store.storage.write('debug', debugRegRes[1] === 'true' ? '*' : debugRegRes[1]);
} else {
  // eslint-disable-next-line no-underscore-dangle
  window.__isDebug = false;
  store.remove('debug');
} // 重要，用于矫正画布执行new Function的window对象上下文
// eslint-disable-next-line no-underscore-dangle


window.__newFunc = function (funContext) {
  // eslint-disable-next-line no-new-func
  return new Function(funContext);
}; // 关闭浏览器前提醒,只有产生过交互才会生效


window.onbeforeunload = function (e) {
  var ev = e || window.event; // 本地调试不生效

  if (location.href.indexOf('localhost') > 0) {
    return;
  }

  var msg = '您确定要离开此页面吗？';
  ev.cancelBubble = true;
  ev.returnValue = true;

  if (e.stopPropagation) {
    e.stopPropagation();
    e.preventDefault();
  }

  return msg;
};

var instance;
var debug = Debug('editor');
EventEmitter.defaultMaxListeners = 100;

var Editor = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(Editor, _EventEmitter);

  var _super = _createSuper(Editor);

  function Editor(config, components, utils) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    _this.config = void 0;
    _this.components = void 0;
    _this.utils = void 0;
    _this.pluginStatus = void 0;
    _this.plugins = void 0;
    _this.locale = void 0;
    _this.hooksFuncs = void 0;
    _this.config = config;
    _this.components = {};
    Object.entries(components).forEach(function (_ref) {
      var key = _ref[0],
          value = _ref[1];
      _this.components[key] = pluginFactory(value);
    });
    _this.utils = _extends({}, editorUtils, {}, utils);
    instance = _assertThisInitialized(_this);
    return _this;
  }

  var _proto = Editor.prototype;

  _proto.init = function init() {
    var _this2 = this;

    var _ref2 = this.config || {},
        hooks = _ref2.hooks,
        _ref2$shortCuts = _ref2.shortCuts,
        shortCuts = _ref2$shortCuts === void 0 ? [] : _ref2$shortCuts,
        lifeCycles = _ref2.lifeCycles;

    this.locale = store.get('lowcode-editor-locale') || 'zh-CN'; // this.messages = this.messagesSet[this.locale];
    // this.i18n = generateI18n(this.locale, this.messages);

    this.pluginStatus = this.initPluginStatus();
    this.initHooks(hooks || []);
    this.emit('editor.beforeInit');

    var init = lifeCycles && lifeCycles.init || function () {}; // 用户可以通过设置extensions.init自定义初始化流程；


    return transformToPromise(init(this)).then(function () {
      // 注册快捷键
      registShortCuts(shortCuts, _this2);

      _this2.emit('editor.afterInit');

      return true;
    })["catch"](function (err) {
      console.error(err);
    });
  };

  _proto.destroy = function destroy() {
    debug('destroy');

    try {
      var _this$config = this.config,
          _this$config$hooks = _this$config.hooks,
          hooks = _this$config$hooks === void 0 ? [] : _this$config$hooks,
          _this$config$shortCut = _this$config.shortCuts,
          shortCuts = _this$config$shortCut === void 0 ? [] : _this$config$shortCut,
          _this$config$lifeCycl = _this$config.lifeCycles,
          lifeCycles = _this$config$lifeCycl === void 0 ? {} : _this$config$lifeCycl;
      unRegistShortCuts(shortCuts);
      this.destroyHooks(hooks);

      if (lifeCycles.destroy) {
        lifeCycles.destroy(this);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  _proto.get = function get(key) {
    return this[key];
  };

  _proto.set = function set(key, val) {
    var _this3 = this;

    if (typeof key === 'string') {
      if (['init', 'destroy', 'get', 'set', 'batchOn', 'batchOff', 'batchOnce'].includes(key)) {
        console.error('init, destroy, get, set, batchOn, batchOff, batchOnce is private attribute');
        return;
      }

      this[key] = val;
    } else if (typeof key === 'object') {
      Object.keys(key).forEach(function (item) {
        _this3[item] = key[item];
      });
    }
  };

  _proto.batchOn = function batchOn(events, lisenter) {
    var _this4 = this;

    if (!Array.isArray(events)) {
      return;
    }

    events.forEach(function (event) {
      _this4.on(event, lisenter);
    });
  };

  _proto.batchOnce = function batchOnce(events, lisenter) {
    var _this5 = this;

    if (!Array.isArray(events)) {
      return;
    }

    events.forEach(function (event) {
      _this5.once(event, lisenter);
    });
  };

  _proto.batchOff = function batchOff(events, lisenter) {
    var _this6 = this;

    if (!Array.isArray(events)) {
      return;
    }

    events.forEach(function (event) {
      _this6.off(event, lisenter);
    });
  } // 销毁hooks中的消息监听
  ;

  _proto.destroyHooks = function destroyHooks(hooks) {
    var _this7 = this;

    if (hooks === void 0) {
      hooks = [];
    }

    hooks.forEach(function (item, idx) {
      if (typeof _this7.hooksFuncs[idx] === 'function') {
        _this7.off(item.message, _this7.hooksFuncs[idx]);
      }
    });
    delete this.hooksFuncs;
  } // 初始化hooks中的消息监听
  ;

  _proto.initHooks = function initHooks(hooks) {
    var _this8 = this;

    if (hooks === void 0) {
      hooks = [];
    }

    this.hooksFuncs = hooks.map(function (item) {
      var func = function func() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        item.handler.apply(item, [_this8].concat(args));
      };

      _this8[item.type](item.message, func);

      return func;
    });
  };

  _proto.initPluginStatus = function initPluginStatus() {
    var _this9 = this;

    var _this$config$plugins = this.config.plugins,
        plugins = _this$config$plugins === void 0 ? {} : _this$config$plugins;
    var pluginAreas = Object.keys(plugins);
    var res = {};
    pluginAreas.forEach(function (area) {
      (plugins[area] || []).forEach(function (plugin) {
        if (plugin.type === 'Divider') {
          return;
        }

        var _ref3 = plugin.props || {},
            visible = _ref3.visible,
            disabled = _ref3.disabled,
            marked = _ref3.marked;

        res[plugin.pluginKey] = {
          visible: typeof visible === 'boolean' ? visible : true,
          disabled: typeof disabled === 'boolean' ? disabled : false,
          marked: typeof marked === 'boolean' ? marked : false
        };
        var pluginClass = _this9.components[plugin.pluginKey]; // 判断如果编辑器插件有init静态方法，则在此执行init方法

        if (pluginClass && pluginClass.init) {
          pluginClass.init(_this9);
        }
      });
    });
    return res;
  };

  return Editor;
}(EventEmitter);

Editor.getInstance = function (config, components, utils) {
  if (!instance) {
    instance = new Editor(config, components, utils);
  }

  return instance;
};

export { Editor as default };