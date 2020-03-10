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
          onClick = _this$props.onClick;
      var addonKey = config && config.addonKey;
      if (disabled || !addonKey) return; //考虑到弹窗情况，延时发送消息

      setTimeout(function () {
        return _this.appHelper.emit(addonKey + ".addon.activate");
      }, 0);

      _this.handleOpen();

      onClick && onClick();
    };

    _this.handleClose = function () {
      var addonKey = _this.props.config && _this.props.config.addonKey;
      var currentAddon = _this.appHelper.addons && _this.appHelper.addons[addonKey];

      if (currentAddon) {
        _this.utils.transformToPromise(currentAddon.close()).then(function () {
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
      var _this$props2 = _this.props,
          active = _this$props2.active,
          disabled = _this$props2.disabled,
          dotted = _this$props2.dotted,
          locked = _this$props2.locked,
          config = _this$props2.config,
          _onClick = _this$props2.onClick;

      var _ref = config || {},
          pluginKey = _ref.pluginKey,
          props = _ref.props;

      var _ref2 = props || {},
          icon = _ref2.icon,
          title = _ref2.title;

      var node = React.createElement(TopIcon, {
        className: "lowcode-top-addon " + pluginKey,
        active: active,
        disabled: disabled,
        locked: locked,
        icon: icon,
        title: title,
        onClick: function onClick() {
          if (disabled) return; //考虑到弹窗情况，延时发送消息

          setTimeout(function () {
            return _this.appHelper.emit(pluginKey + ".addon.activate");
          }, 0);
          clickCallback && clickCallback();
          _onClick && _onClick();
        }
      });
      return dotted ? React.createElement(_Badge, {
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
    var config = this.props.config;
    var pluginKey = config && config.pluginKey; // const appHelper = this.appHelper;
    // if (appHelper && addonKey) {
    //   appHelper.on(`${addonKey}.dialog.show`, this.handleShow);
    //   appHelper.on(`${addonKey}.dialog.close`, this.handleClose);
    // }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {// const { config } = this.props;
    // const addonKey = config && config.addonKey;
    // const appHelper = this.appHelper;
    // if (appHelper && addonKey) {
    //   appHelper.off(`${addonKey}.dialog.show`, this.handleShow);
    //   appHelper.off(`${addonKey}.dialog.close`, this.handleClose);
    // }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props3 = this.props,
        active = _this$props3.active,
        dotted = _this$props3.dotted,
        locked = _this$props3.locked,
        disabled = _this$props3.disabled,
        config = _this$props3.config,
        editor = _this$props3.editor,
        Comp = _this$props3.pluginClass;

    var _ref3 = config || {},
        pluginKey = _ref3.pluginKey,
        pluginProps = _ref3.pluginProps,
        props = _ref3.props,
        type = _ref3.type;

    var _ref4 = props || {},
        _onClick2 = _ref4.onClick,
        title = _ref4.title;

    var dialogVisible = this.state.dialogVisible;
    if (!pluginKey || !type || !Comp) return null;
    var node = React.createElement(Comp, _extends({
      active: active,
      locked: locked,
      disabled: disabled,
      config: config,
      onClick: function onClick() {
        _onClick2 && _onClick2.call(null, editor);
      }
    }, pluginProps));

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
          title: title
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
        return dotted ? React.createElement(_Badge, {
          dot: true
        }, node) : node;

      default:
        return null;
    }
  };

  return TopPlugin;
}(PureComponent);

TopPlugin.displayName = 'lowcodeTopPlugin';
TopPlugin.defaultProps = {
  active: false,
  config: {},
  disabled: false,
  dotted: false,
  locked: false,
  onClick: function onClick() {}
};
export { TopPlugin as default };