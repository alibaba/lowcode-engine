import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import './index.scss';

var RightArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(RightArea, _PureComponent);

  function RightArea(props) {
    return _PureComponent.call(this, props) || this;
  }

  var _proto = RightArea.prototype;

  _proto.render = function render() {
    return React.createElement("div", {
      className: "lowcode-right-area"
    });
  };

  return RightArea;
}(PureComponent);

RightArea.displayName = 'lowcodeRightArea';
export { RightArea as default };