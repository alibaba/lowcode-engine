import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppContext from '@ali/iceluna-sdk/lib/context/appContext';
import { Balloon, Dialog, Icon, Badge } from '@alife/next';
import './index.scss';

var LeftAddon = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(LeftAddon, _PureComponent);

  function LeftAddon(_props, context) {
    var _this;

    _this = _PureComponent.call(this, _props, context) || this;

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
      // todo 对话框类型的插件初始时拿不到插件实例
      _this.setState({
        dialogVisible: true
      });
    };

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

    _this.renderIcon = function (clickCallback) {
      var _this$props2 = _this.props,
          active = _this$props2.active,
          disabled = _this$props2.disabled,
          dotted = _this$props2.dotted,
          locked = _this$props2.locked,
          _onClick = _this$props2.onClick,
          config = _this$props2.config;

      var _ref = config || {},
          addonKey = _ref.addonKey,
          props = _ref.props;

      var _ref2 = props || {},
          icon = _ref2.icon,
          title = _ref2.title;

      return React.createElement("div", {
        className: classNames('luna-left-addon', addonKey, {
          active: active,
          disabled: disabled,
          locked: locked
        }),
        "data-tooltip": title,
        onClick: function onClick() {
          if (disabled) return; //考虑到弹窗情况，延时发送消息

          clickCallback && clickCallback();
          _onClick && _onClick();
        }
      }, dotted ? React.createElement(Badge, {
        dot: true
      }, React.createElement(Icon, {
        type: icon,
        size: "small"
      })) : React.createElement(Icon, {
        type: icon,
        size: "small"
      }));
    };

    _this.state = {
      dialogVisible: false
    };
    _this.appHelper = context.appHelper;
    _this.utils = _this.appHelper.utils;
    _this.constants = _this.appHelper.constants;
    return _this;
  }

  var _proto = LeftAddon.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var config = this.props.config;
    var addonKey = config && config.addonKey;
    var appHelper = this.appHelper;

    if (appHelper && addonKey) {
      appHelper.on(addonKey + ".dialog.show", this.handleShow);
      appHelper.on(addonKey + ".dialog.close", this.handleClose);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var config = this.props.config;
    var appHelper = this.appHelper;
    var addonKey = config && config.addonKey;

    if (appHelper && addonKey) {
      appHelper.off(addonKey + ".dialog.show", this.handleShow);
      appHelper.off(addonKey + ".dialog.close", this.handleClose);
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props3 = this.props,
        dotted = _this$props3.dotted,
        locked = _this$props3.locked,
        active = _this$props3.active,
        disabled = _this$props3.disabled,
        config = _this$props3.config;

    var _ref3 = config || {},
        addonKey = _ref3.addonKey,
        props = _ref3.props,
        type = _ref3.type,
        addonProps = _ref3.addonProps;

    var _ref4 = props || {},
        _onClick2 = _ref4.onClick,
        title = _ref4.title;

    var dialogVisible = this.state.dialogVisible;
    var _this$context = this.context,
        appHelper = _this$context.appHelper,
        components = _this$context.components;
    if (!addonKey || !type || !props) return null;
    var componentName = appHelper.utils.generateAddonCompName(addonKey);
    var localeProps = {};
    var locale = appHelper.locale,
        messages = appHelper.messages;

    if (locale) {
      localeProps.locale = locale;
    }

    if (messages && messages[componentName]) {
      localeProps.messages = messages[componentName];
    }

    var AddonComp = components && components[componentName];
    var node = AddonComp && React.createElement(AddonComp, _extends({
      active: active,
      locked: locked,
      disabled: disabled,
      config: config,
      onClick: function onClick() {
        _onClick2 && _onClick2.call(null, appHelper);
      }
    }, localeProps, addonProps || {})) || null;

    switch (type) {
      case 'LinkIcon':
        return React.createElement("a", props.linkProps || {}, this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, appHelper);
        }));

      case 'Icon':
        return this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, appHelper);
        });

      case 'DialogIcon':
        return React.createElement(Fragment, null, this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, appHelper);

          _this2.handleOpen();
        }), React.createElement(Dialog, _extends({
          onOk: function onOk() {
            appHelper.emit(addonKey + ".dialog.onOk");

            _this2.handleClose();
          },
          onCancel: this.handleClose,
          onClose: this.handleClose,
          title: title
        }, props.dialogProps || {}, {
          visible: dialogVisible
        }), node));

      case 'BalloonIcon':
        return React.createElement(Balloon, _extends({
          trigger: this.renderIcon(function () {
            _onClick2 && _onClick2.call(null, appHelper);
          }),
          align: "r",
          triggerType: ['click', 'hover']
        }, props.balloonProps || {}), node);

      case 'PanelIcon':
        return this.renderIcon(function () {
          _onClick2 && _onClick2.call(null, appHelper);

          _this2.handleOpen();
        });

      case 'Custom':
        return dotted ? React.createElement(Badge, {
          dot: true
        }, node) : node;

      default:
        return null;
    }
  };

  return LeftAddon;
}(PureComponent);

LeftAddon.displayName = 'LunaLeftAddon';
LeftAddon.propTypes = {
  active: PropTypes.bool,
  config: PropTypes.shape({
    addonKey: PropTypes.string,
    addonProps: PropTypes.object,
    props: PropTypes.object,
    type: PropTypes.oneOf(['DialogIcon', 'BalloonIcon', 'PanelIcon', 'LinkIcon', 'Icon', 'Custom'])
  }),
  disabled: PropTypes.bool,
  dotted: PropTypes.bool,
  locked: PropTypes.bool,
  onClick: PropTypes.func
};
LeftAddon.defaultProps = {
  active: false,
  config: {},
  disabled: false,
  dotted: false,
  locked: false,
  onClick: function onClick() {}
};
LeftAddon.contextType = AppContext;
export { LeftAddon as default };