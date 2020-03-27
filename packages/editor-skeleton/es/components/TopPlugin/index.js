import _Balloon from "@alifd/next/es/balloon";
import _Dialog from "@alifd/next/es/dialog";
import _extends from "@babel/runtime/helpers/extends";
import _Badge from "@alifd/next/es/badge";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent, Fragment } from 'react';
import TopIcon from '../TopIcon';
import './index.scss';

var TopPlugin = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(TopPlugin, _PureComponent);

  function TopPlugin(_props, context) {
    var _this;

    _this = _PureComponent.call(this, _props, context) || this;

    _this.handleShow = function () {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          config = _this$props.config,
          onClick = _this$props.onClick,
          editor = _this$props.editor;
      var pluginKey = config && config.pluginKey;
      if (disabled || !pluginKey) return;

      _this.handleOpen(); // 考虑到弹窗情况，延时发送消息


      setTimeout(function () {
        editor.emit(pluginKey + ".plugin.activate");
      }, 0);
      onClick && onClick();
    };

    _this.handleClose = function () {
      var _this$props2 = _this.props,
          config = _this$props2.config,
          editor = _this$props2.editor;
      var pluginKey = config && config.pluginKey;
      var plugin = editor.plugins && editor.plugins[pluginKey];

      if (plugin) {
        plugin.close().then(function () {
          _this.setState({
            dialogVisible: false
          });
        });
      }
    };

    _this.handleOpen = function () {
      // todo dialog类型的插件初始时拿不动插件实例
      _this.setState({
        dialogVisible: true
      });
    };

    _this.renderIcon = function (clickCallback) {
      var _this$props3 = _this.props,
          active = _this$props3.active,
          disabled = _this$props3.disabled,
          marked = _this$props3.marked,
          locked = _this$props3.locked,
          config = _this$props3.config,
          _onClick = _this$props3.onClick,
          editor = _this$props3.editor;

      var _ref = config || {},
          pluginKey = _ref.pluginKey,
          props = _ref.props;

      var _ref2 = props || {},
          icon = _ref2.icon,
          title = _ref2.title;

      var node = React.createElement(TopIcon, {
        className: "lowcode-top-plugin " + pluginKey,
        active: active,
        disabled: disabled,
        locked: locked,
        icon: icon,
        title: title,
        onClick: function onClick() {
          if (disabled) return; // 考虑到弹窗情况，延时发送消息

          setTimeout(function () {
            editor.emit(pluginKey + ".plugin.activate");
          }, 0);
          clickCallback && clickCallback();
          _onClick && _onClick();
        }
      });
      return marked ? React.createElement(_Badge, {
        dot: true
      }, node) : node;
    };

    _this.state = {
      dialogVisible: false
    };
    return _this;
  }

  var _proto = TopPlugin.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this$props4 = this.props,
        config = _this$props4.config,
        editor = _this$props4.editor;
    var pluginKey = config && config.pluginKey;

    if (editor && pluginKey) {
      editor.on(pluginKey + ".dialog.show", this.handleShow);
      editor.on(pluginKey + ".dialog.close", this.handleClose);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var _this$props5 = this.props,
        config = _this$props5.config,
        editor = _this$props5.editor;
    var pluginKey = config && config.pluginKey;

    if (editor && pluginKey) {
      editor.off(pluginKey + ".dialog.show", this.handleShow);
      editor.off(pluginKey + ".dialog.close", this.handleClose);
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props6 = this.props,
        active = _this$props6.active,
        marked = _this$props6.marked,
        locked = _this$props6.locked,
        disabled = _this$props6.disabled,
        config = _this$props6.config,
        editor = _this$props6.editor,
        Comp = _this$props6.pluginClass;

    var _ref3 = config || {},
        pluginKey = _ref3.pluginKey,
        pluginProps = _ref3.pluginProps,
        props = _ref3.props,
        type = _ref3.type;

    var _ref4 = props || {},
        _onClick2 = _ref4.onClick,
        title = _ref4.title;

    var dialogVisible = this.state.dialogVisible;
    if (!pluginKey || !type) return null;
    var node = Comp ? React.createElement(Comp, _extends({
      editor: editor,
      active: active,
      locked: locked,
      disabled: disabled,
      config: config,
      onClick: function onClick() {
        _onClick2 && _onClick2.call(null, editor);
      }
    }, pluginProps)) : null;

    switch (type) {
      case 'LinkIcon':
        return React.createElement("a", props.linkProps, this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, editor);
        }));

      case 'Icon':
        return this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, editor);
        });

      case 'DialogIcon':
        return React.createElement(Fragment, null, this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, editor);

          _this2.handleOpen();
        }), React.createElement(_Dialog, _extends({
          onOk: function onOk() {
            editor.emit(pluginKey + ".dialog.onOk");

            _this2.handleClose();
          },
          onCancel: this.handleClose,
          onClose: this.handleClose,
          title: title,
          style: _extends({
            width: 500
          }, props.dialogProps && props.dialogProps.style)
        }, props.dialogProps, {
          visible: dialogVisible
        }), node));

      case 'BalloonIcon':
        return React.createElement(_Balloon, _extends({
          trigger: this.renderIcon(function () {
            _onClick2 && _onClick2.call(null, editor);
          }),
          triggerType: ['click', 'hover']
        }, props.balloonProps), node);

      case 'Custom':
        return marked ? React.createElement(_Badge, {
          dot: true
        }, node) : node;

      default:
        return null;
    }
  };

  return TopPlugin;
}(PureComponent);

TopPlugin.displayName = 'LowcodeTopPlugin';
TopPlugin.defaultProps = {
  active: false,
  config: {},
  disabled: false,
  marked: false,
  locked: false,
  onClick: function onClick() {}
};
export { TopPlugin as default };