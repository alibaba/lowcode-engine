import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import './index.scss';

var Panel = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(Panel, _PureComponent);

  function Panel(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.state = {
      width: props.defaultWidth
    };
    return _this;
  }

  var _proto = Panel.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        align = _this$props.align,
        draggable = _this$props.draggable,
        floatable = _this$props.floatable,
        visible = _this$props.visible;
    var width = this.state.width;
    return React.createElement("div", {
      className: classNames('lowcode-panel', align, {
        draggable: draggable,
        floatable: floatable,
        visible: visible
      }),
      style: {
        width: width,
        display: visible ? '' : 'none'
      }
    }, this.props.children, React.createElement("div", {
      className: "drag-area"
    }));
  };

  return Panel;
}(PureComponent);

Panel.displayName = 'LowcodePanel';
Panel.defaultProps = {
  align: 'left',
  defaultWidth: 240,
  minWidth: 100,
  draggable: true,
  floatable: false,
  visible: true
};
export { Panel as default };