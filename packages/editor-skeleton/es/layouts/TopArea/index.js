import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import './index.scss';

var TopArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(TopArea, _PureComponent);

  function TopArea(props) {
    return _PureComponent.call(this, props) || this;
  }

  var _proto = TopArea.prototype;

  _proto.render = function render() {
    return React.createElement("div", {
      className: "lowcode-top-area"
    });
  };

  return TopArea;
}(PureComponent);

TopArea.displayName = 'lowcodeTopArea';
export { TopArea as default };