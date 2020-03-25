import _Icon from "@alifd/next/es/icon";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import './index.scss';

var TopIcon = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(TopIcon, _PureComponent);

  function TopIcon() {
    return _PureComponent.apply(this, arguments) || this;
  }

  var _proto = TopIcon.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        active = _this$props.active,
        disabled = _this$props.disabled,
        icon = _this$props.icon,
        locked = _this$props.locked,
        title = _this$props.title,
        className = _this$props.className,
        id = _this$props.id,
        style = _this$props.style,
        onClick = _this$props.onClick;
    return React.createElement("div", {
      className: classNames('lowcode-top-icon', className, {
        active: active,
        disabled: disabled,
        locked: locked
      }),
      "data-tooltip": title,
      id: id,
      style: style,
      onClick: disabled ? undefined : onClick
    }, React.createElement(_Icon, {
      type: icon
    }));
  };

  return TopIcon;
}(PureComponent);

TopIcon.displayName = 'LowcodeTopIcon';
TopIcon.defaultProps = {
  active: false,
  className: '',
  disabled: false,
  icon: '',
  id: '',
  locked: false,
  onClick: function onClick() {},
  style: {},
  title: ''
};
export { TopIcon as default };