import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import './index.scss';

var LeftAreaPanel = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(LeftAreaPanel, _PureComponent);

  function LeftAreaPanel(props) {
    return _PureComponent.call(this, props) || this;
  }

  var _proto = LeftAreaPanel.prototype;

  _proto.render = function render() {
    return React.createElement("div", {
      className: "lowcode-left-area-nav"
    });
  };

  return LeftAreaPanel;
}(PureComponent);

LeftAreaPanel.displayName = 'lowcodeLeftAreaNav';
export { LeftAreaPanel as default };