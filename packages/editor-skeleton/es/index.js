import _ConfigProvider from "@alifd/next/es/config-provider";
import _Loading from "@alifd/next/es/loading";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react'; // import Editor from '@ali/lowcode-engine-editor';

import TopArea from './layouts/TopArea';
import LeftArea from './layouts/LeftArea';
import CenterArea from './layouts/CenterArea';
import RightArea from './layouts/RightArea';
import './global.scss';

var Skeleton = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(Skeleton, _PureComponent);

  function Skeleton(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this; // this.editor = new Editor(props.config, props.utils);

    _this.editor = {
      on: function on() {},
      off: function off() {},
      config: props.config,
      pluginComponents: props.pluginComponents
    };
    return _this;
  }

  var _proto = Skeleton.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {// this.editor && this.editor.destroy();
    // this.editor = null;
  };

  _proto.render = function render() {
    var _this$props = this.props,
        location = _this$props.location,
        history = _this$props.history,
        messages = _this$props.messages;
    this.editor.location = location;
    this.editor.history = history;
    this.editor.messages = messages;
    return React.createElement(_ConfigProvider, null, React.createElement(_Loading, {
      tip: "Loading",
      size: "large",
      visible: false,
      shape: "fusion-reactor",
      fullScreen: true
    }, React.createElement("div", {
      className: "lowcode-editor"
    }, React.createElement(TopArea, {
      editor: this.editor
    }), React.createElement("div", {
      className: "lowcode-main-content"
    }, React.createElement(LeftArea.Nav, {
      editor: this.editor
    }), React.createElement(LeftArea.Panel, {
      editor: this.editor
    }), React.createElement(CenterArea, {
      editor: this.editor
    }), React.createElement(RightArea, {
      editor: this.editor
    })))));
  };

  return Skeleton;
}(PureComponent);

Skeleton.displayName = 'lowcodeEditorSkeleton';
export { Skeleton as default };