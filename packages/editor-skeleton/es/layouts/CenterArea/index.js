import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import './index.scss';

var CenterArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(CenterArea, _PureComponent);

  function CenterArea(props) {
    return _PureComponent.call(this, props) || this;
  }

  var _proto = CenterArea.prototype;

  _proto.render = function render() {
    return React.createElement("div", {
      className: "lowcode-center-area"
    });
  };

  return CenterArea;
}(PureComponent);

CenterArea.displayName = 'lowcodeCenterArea';
export { CenterArea as default };