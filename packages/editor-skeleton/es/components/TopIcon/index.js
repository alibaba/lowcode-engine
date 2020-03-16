import _Button from "@alifd/next/es/button";
import _Icon from "@alifd/next/es/icon";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
        showTitle = _this$props.showTitle,
        onClick = _this$props.onClick;
    return React.createElement(_Button, {
      type: "normal",
      size: "large",
      text: true,
      className: classNames('lowcode-top-btn', className, {
        active: active,
        disabled: disabled,
        locked: locked
      }),
      id: id,
      style: style,
      onClick: disabled ? null : onClick
    }, React.createElement("div", null, React.createElement(_Icon, {
      size: "large",
      type: icon
    }), showTitle && React.createElement("span", null, title)));
  };

  return TopIcon;
}(PureComponent);

TopIcon.displayName = 'TopIcon';
TopIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.string,
  locked: PropTypes.bool,
  onClick: PropTypes.func,
  showTitle: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string
};
TopIcon.defaultProps = {
  active: false,
  className: '',
  disabled: false,
  icon: '',
  id: '',
  locked: false,
  onClick: function onClick() {},
  showTitle: false,
  style: {},
  title: ''
};
export { TopIcon as default };