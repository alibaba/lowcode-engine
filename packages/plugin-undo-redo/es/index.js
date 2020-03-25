import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { PureComponent } from 'react';
import './index.scss';
import { TopIcon } from '@ali/lowcode-editor-skeleton';

var UndoRedo = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(UndoRedo, _PureComponent);

  var _super = _createSuper(UndoRedo);

  function UndoRedo(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.history = void 0;

    _this.init = function () {
      var _editor$designer, _this$history;

      var editor = _this.props.editor;
      _this.history = (_editor$designer = editor.designer) === null || _editor$designer === void 0 ? void 0 : _editor$designer.currentHistory;

      _this.updateState(((_this$history = _this.history) === null || _this$history === void 0 ? void 0 : _this$history.getState()) || 0);

      editor.on('designer.history-change', function (history) {
        var _this$history2;

        _this.history = history;

        _this.updateState(((_this$history2 = _this.history) === null || _this$history2 === void 0 ? void 0 : _this$history2.getState()) || 0);
      });
    };

    _this.updateState = function (state) {
      _this.setState({
        undoEnable: !!(state & 1),
        redoEnable: !!(state & 2)
      });
    };

    _this.handleUndoClick = function () {
      var _this$history3;

      (_this$history3 = _this.history) === null || _this$history3 === void 0 ? void 0 : _this$history3.back();
    };

    _this.handleRedoClick = function () {
      var _this$history4;

      (_this$history4 = _this.history) === null || _this$history4 === void 0 ? void 0 : _this$history4.forward();
    };

    _this.state = {
      undoEnable: false,
      redoEnable: false
    };

    if (props.editor.designer) {
      _this.init();
    } else {
      props.editor.on('designer.ready', function () {
        _this.init();
      });
    }

    return _this;
  }

  var _proto = UndoRedo.prototype;

  _proto.render = function render() {
    var _this$state = this.state,
        undoEnable = _this$state.undoEnable,
        redoEnable = _this$state.redoEnable;
    return /*#__PURE__*/React.createElement("div", {
      className: "lowcode-plugin-undo-redo"
    }, /*#__PURE__*/React.createElement(TopIcon, {
      icon: "houtui",
      title: "\u540E\u9000",
      disabled: !undoEnable,
      onClick: this.handleUndoClick
    }), /*#__PURE__*/React.createElement(TopIcon, {
      icon: "qianjin",
      title: "\u524D\u8FDB",
      disabled: !redoEnable,
      onClick: this.handleRedoClick
    }));
  };

  return UndoRedo;
}(PureComponent);

UndoRedo.display = 'LowcodeUndoRedo';
export { UndoRedo as default };