import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { obj, log } from '../util';
import getContextProps from './get-context-props';
import ErrorBoundary from './error-boundary';

var shallowEqual = obj.shallowEqual;


function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
}

var globalLocales = void 0;
var currentGlobalLanguage = 'zh-cn';
var currentGlobalLocale = {};
var currentGlobalRtl = void 0;

export function initLocales(locales) {
    globalLocales = locales;

    if (locales) {
        currentGlobalLocale = locales[currentGlobalLanguage];

        if (typeof currentGlobalRtl !== 'boolean') {
            currentGlobalRtl = currentGlobalLocale && currentGlobalLocale.rtl;
        }
    }
}

export function setLanguage(language) {
    if (globalLocales) {
        currentGlobalLanguage = language;
        currentGlobalLocale = globalLocales[language];

        if (typeof currentGlobalRtl !== 'boolean') {
            currentGlobalRtl = currentGlobalLocale && currentGlobalLocale.rtl;
        }
    }
}

export function setLocale(locale) {
    currentGlobalLocale = _extends({}, globalLocales ? globalLocales[currentGlobalLanguage] : {}, locale);

    if (typeof currentGlobalRtl !== 'boolean') {
        currentGlobalRtl = currentGlobalLocale && currentGlobalLocale.rtl;
    }
}

export function setDirection(dir) {
    currentGlobalRtl = dir === 'rtl';
}

export function getLocale() {
    return currentGlobalLocale;
}

export function getLanguage() {
    return currentGlobalLanguage;
}

export function getDirection() {
    return currentGlobalRtl;
}

export function config(Component) {
    var _class, _temp;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // 非 forwardRef 创建的 class component
    if (obj.isClassComponent(Component) && Component.prototype.shouldComponentUpdate === undefined) {
        // class component: 通过定义 shouldComponentUpdate 改写成 pure component, 有refs
        Component.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
            if (this.props.pure) {
                return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
            }

            return true;
        };
    }

    var ConfigedComponent = (_temp = _class = function (_React$Component) {
        _inherits(ConfigedComponent, _React$Component);

        function ConfigedComponent(props, context) {
            _classCallCheck(this, ConfigedComponent);

            var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

            _this._getInstance = _this._getInstance.bind(_this);
            _this._deprecated = _this._deprecated.bind(_this);
            return _this;
        }

        ConfigedComponent.prototype._getInstance = function _getInstance(ref) {
            var _this2 = this;

            this._instance = ref;

            if (this._instance && options.exportNames) {
                options.exportNames.forEach(function (name) {
                    var field = _this2._instance[name];
                    if (typeof field === 'function') {
                        _this2[name] = field.bind(_this2._instance);
                    } else {
                        _this2[name] = field;
                    }
                });
            }
        };

        ConfigedComponent.prototype._deprecated = function _deprecated() {
            if (this.context.nextWarning !== false) {
                log.deprecated.apply(log, arguments);
            }
        };

        ConfigedComponent.prototype.getInstance = function getInstance() {
            return this._instance;
        };

        ConfigedComponent.prototype.render = function render() {
            var _props = this.props,
                prefix = _props.prefix,
                locale = _props.locale,
                pure = _props.pure,
                rtl = _props.rtl,
                device = _props.device,
                popupContainer = _props.popupContainer,
                errorBoundary = _props.errorBoundary,
                others = _objectWithoutProperties(_props, ['prefix', 'locale', 'pure', 'rtl', 'device', 'popupContainer', 'errorBoundary']);

            var _context = this.context,
                nextPrefix = _context.nextPrefix,
                _context$nextLocale = _context.nextLocale,
                nextLocale = _context$nextLocale === undefined ? {} : _context$nextLocale,
                nextPure = _context.nextPure,
                nextRtl = _context.nextRtl,
                nextDevice = _context.nextDevice,
                nextPopupContainer = _context.nextPopupContainer,
                nextErrorBoundary = _context.nextErrorBoundary;


            var displayName = options.componentName || getDisplayName(Component);
            var contextProps = getContextProps({
                prefix: prefix,
                locale: locale,
                pure: pure,
                device: device,
                popupContainer: popupContainer,
                rtl: rtl,
                errorBoundary: errorBoundary
            }, {
                nextPrefix: nextPrefix,
                nextLocale: _extends({}, currentGlobalLocale, nextLocale),
                nextPure: nextPure,
                nextDevice: nextDevice,
                nextPopupContainer: nextPopupContainer,
                nextRtl: typeof nextRtl === 'boolean' ? nextRtl : currentGlobalRtl === true ? true : undefined,
                nextErrorBoundary: nextErrorBoundary
            }, displayName);

            // errorBoundary is only for <ErrorBoundary>
            var newContextProps = ['prefix', 'locale', 'pure', 'rtl', 'device', 'popupContainer'].reduce(function (ret, name) {
                if (typeof contextProps[name] !== 'undefined') {
                    ret[name] = contextProps[name];
                }
                return ret;
            }, {});

            if ('pure' in newContextProps && newContextProps.pure) {
                log.warning('pure of ConfigProvider is deprecated, use Function Component or React.PureComponent');
            }

            var newOthers = options.transform ? options.transform(others, this._deprecated) : others;

            var content = React.createElement(Component, _extends({}, newOthers, newContextProps, {
                ref: obj.isClassComponent(Component) ? this._getInstance : null
            }));

            var _contextProps$errorBo = contextProps.errorBoundary,
                open = _contextProps$errorBo.open,
                othersBoundary = _objectWithoutProperties(_contextProps$errorBo, ['open']);

            return open ? React.createElement(
                ErrorBoundary,
                othersBoundary,
                content
            ) : content;
        };

        return ConfigedComponent;
    }(React.Component), _class.propTypes = _extends({}, Component.propTypes || {}, {
        prefix: PropTypes.string,
        locale: PropTypes.object,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        device: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
        popupContainer: PropTypes.any,
        errorBoundary: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    }), _class.contextTypes = _extends({}, Component.contextTypes || {}, {
        nextPrefix: PropTypes.string,
        nextLocale: PropTypes.object,
        nextPure: PropTypes.bool,
        nextRtl: PropTypes.bool,
        nextWarning: PropTypes.bool,
        nextDevice: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
        nextPopupContainer: PropTypes.any,
        nextErrorBoundary: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    }), _temp);
    ConfigedComponent.displayName = 'ConfigedComponent';


    ConfigedComponent.displayName = 'Config(' + getDisplayName(Component) + ')';

    hoistNonReactStatic(ConfigedComponent, Component);

    return ConfigedComponent;
}