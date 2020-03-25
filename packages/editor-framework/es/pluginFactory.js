import _extends from "@babel/runtime/helpers/extends";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { createRef, PureComponent } from 'react';
import EditorContext from './context';
import { acceptsRef, generateI18n, isEmpty, transformToPromise } from './utils';
export default function pluginFactory(Comp) {
  var LowcodePlugin = /*#__PURE__*/function (_PureComponent) {
    _inheritsLoose(LowcodePlugin, _PureComponent);

    var _super = _createSuper(LowcodePlugin);

    function LowcodePlugin(props, context) {
      var _extends2;

      var _this;

      _this = _PureComponent.call(this, props, context) || this;
      _this.ref = void 0;
      _this.editor = void 0;
      _this.pluginKey = void 0;
      _this.i18n = void 0;

      _this.open = function () {
        if (_this.ref && _this.ref.open && typeof _this.ref.open === 'function') {
          return transformToPromise(_this.ref.open());
        }

        return Promise.resolve();
      };

      _this.close = function () {
        if (_this.ref && _this.ref.close && typeof _this.ref.close === 'function') {
          return transformToPromise(_this.ref.close());
        }

        return Promise.resolve();
      };

      if (isEmpty(props.config) || !props.config.pluginKey) {
        console.warn('lowcode editor plugin has wrong config');
        return _assertThisInitialized(_this);
      }

      var editor = props.editor;
      _this.ref = createRef(); // 注册插件

      _this.editor = editor;
      _this.pluginKey = props.config.pluginKey;
      var defaultProps = Comp.defaultProps || {};
      var locale = _this.editor.get('locale') || defaultProps.locale || 'zh-CN';
      var editorMessages = _this.editor.get('messages') || {};
      var messages = editorMessages[_this.pluginKey] || defaultProps.messages || {};
      _this.i18n = generateI18n(locale, messages);
      editor.set('plugins', _extends({}, editor.plugins, (_extends2 = {}, _extends2[_this.pluginKey] = _assertThisInitialized(_this), _extends2)));
      return _this;
    }

    var _proto = LowcodePlugin.prototype;

    _proto.componentWillUnmount = function componentWillUnmount() {
      // 销毁插件
      if (this.pluginKey && this.editor && this.editor.plugins) {
        delete this.editor.plugins[this.pluginKey];
      }
    };

    _proto.render = function render() {
      var config = this.props.config;

      var props = _extends({
        i18n: this.i18n,
        editor: this.editor,
        config: config
      }, config.pluginProps);

      if (acceptsRef(Comp)) {
        props.ref = this.ref;
      }

      return /*#__PURE__*/React.createElement(Comp, props);
    };

    return LowcodePlugin;
  }(PureComponent);

  LowcodePlugin.displayName = 'LowcodeEditorPlugin';
  LowcodePlugin.contextType = EditorContext;
  LowcodePlugin.init = Comp.init;
  return LowcodePlugin;
}