import _ConfigProvider from "@alifd/next/es/config-provider";
import _Loading from "@alifd/next/es/loading";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react-dom'; // import Editor from '@ali/lowcode-engine-editor';

import './global.scss';

var Skeleton = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(Skeleton, _PureComponent);

  function Skeleton(props) {
    return _PureComponent.call(this, props) || this; // this.editor = new Editor(props.config, props.utils);
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
    return React.createElement(_ConfigProvider, {
      locale: messages[appHelper.locale]
    }, React.createElement(_Loading, {
      tip: this.i18n('loading'),
      size: "large",
      visible: loading || !initReady,
      shape: "fusion-reactor",
      fullScreen: true
    }, React.createElement("div", {
      className: "lowcode-editor"
    })));
  };

  return Skeleton;
}(PureComponent);

Skeleton.displayName = 'lowcodeEditorSkeleton';
export { Skeleton as default };