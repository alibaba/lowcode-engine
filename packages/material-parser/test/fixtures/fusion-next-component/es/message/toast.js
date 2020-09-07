import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Overlay from '../overlay';
import ConfigProvider from '../config-provider';
import { guid } from '../util';
import Message from './message';

var config = ConfigProvider.config;


var instance = void 0;
var timeouts = {};

var Mask = (_temp2 = _class = function (_React$Component) {
    _inherits(Mask, _React$Component);

    function Mask() {
        var _temp, _this, _ret;

        _classCallCheck(this, Mask);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
            visible: true
        }, _this.handleClose = function () {
            var silent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            _this.setState({
                visible: false
            });

            if (!silent) {
                _this.props.onClose && _this.props.onClose();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Mask.prototype.componentWillUnmount = function componentWillUnmount() {
        var timeoutId = this.props.timeoutId;


        if (timeoutId in timeouts) {
            var timeout = timeouts[timeoutId];
            clearTimeout(timeout);
            delete timeouts[timeoutId];
        }
    };

    Mask.prototype.render = function render() {
        /* eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            type = _props.type,
            title = _props.title,
            content = _props.content,
            align = _props.align,
            offset = _props.offset,
            hasMask = _props.hasMask,
            afterClose = _props.afterClose,
            animation = _props.animation,
            overlayProps = _props.overlayProps,
            timeoutId = _props.timeoutId,
            className = _props.className,
            style = _props.style,
            others = _objectWithoutProperties(_props, ['prefix', 'type', 'title', 'content', 'align', 'offset', 'hasMask', 'afterClose', 'animation', 'overlayProps', 'timeoutId', 'className', 'style']);
        /* eslint-enable */


        var visible = this.state.visible;

        return React.createElement(
            Overlay,
            _extends({}, overlayProps, {
                prefix: prefix,
                animation: animation,
                visible: visible,
                align: align,
                offset: offset,
                hasMask: hasMask,
                afterClose: afterClose
            }),
            React.createElement(
                Message,
                _extends({}, others, {
                    prefix: prefix,
                    visible: true,
                    type: type,
                    shape: 'toast',
                    title: title,
                    style: style,
                    className: prefix + 'message-wrapper ' + className,
                    onClose: this.handleClose
                }),
                content
            )
        );
    };

    return Mask;
}(React.Component), _class.contextTypes = {
    prefix: PropTypes.string
}, _class.propTypes = {
    prefix: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.node,
    content: PropTypes.node,
    align: PropTypes.string,
    offset: PropTypes.array,
    hasMask: PropTypes.bool,
    afterClose: PropTypes.func,
    animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    overlayProps: PropTypes.object,
    onClose: PropTypes.func,
    timeoutId: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    align: 'tc tc',
    offset: [0, 30],
    hasMask: false,
    animation: {
        in: 'pulse',
        out: 'zoomOut'
    },
    style: {},
    className: ''
}, _temp2);
Mask.displayName = 'Mask';


var NewMask = config(Mask);

var create = function create(props) {
    /* eslint-disable no-unused-vars */
    var duration = props.duration,
        afterClose = props.afterClose,
        others = _objectWithoutProperties(props, ['duration', 'afterClose']);
    /* eslint-enable no-unused-vars */

    var div = document.createElement('div');
    document.body.appendChild(div);
    var closeChain = function closeChain() {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
        afterClose && afterClose();
    };

    var newContext = ConfigProvider.getContext();

    var mask = void 0,
        myRef = void 0,
        destroyed = false;
    var destroy = function destroy() {
        var inc = mask && mask.getInstance();
        inc && inc.handleClose(true);
        destroyed = true;
    };

    ReactDOM.render(React.createElement(
        ConfigProvider,
        newContext,
        React.createElement(NewMask, _extends({
            afterClose: closeChain
        }, others, {
            ref: function ref(_ref) {
                myRef = _ref;
            }
        }))
    ), div, function () {
        mask = myRef;
        if (mask && destroyed) {
            destroy();
        }
    });

    return {
        component: mask,
        destroy: destroy
    };
};

function handleConfig(config, type) {
    var newConfig = {};

    if (typeof config === 'string' || React.isValidElement(config)) {
        newConfig.title = config;
    } else if (isObject(config)) {
        newConfig = _extends({}, config);
    }
    if (typeof newConfig.duration !== 'number') {
        newConfig.duration = 3000;
    }
    if (type) {
        newConfig.type = type;
    }

    return newConfig;
}

function isObject(obj) {
    return {}.toString.call(obj) === '[object Object]';
}

function open(config, type) {
    close();
    config = handleConfig(config, type);
    var timeoutId = guid();
    instance = create(_extends({}, config, { timeoutId: timeoutId }));

    if (config.duration > 0) {
        var timeout = setTimeout(close, config.duration);
        timeouts[timeoutId] = timeout;
    }
}

function close() {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}

/**
 * 创建提示弹层
 * @exportName show
 * @param {Object} props 属性对象
 */
function show(config) {
    open(config);
}

/**
 * 关闭提示弹层
 * @exportName hide
 */
function hide() {
    close();
}

/**
 * 创建成功提示弹层
 * @exportName success
 * @param {Object} props 属性对象
 */
function success(config) {
    open(config, 'success');
}

/**
 * 创建警告提示弹层
 * @exportName warning
 * @param {Object} props 属性对象
 */
function warning(config) {
    open(config, 'warning');
}

/**
 * 创建错误提示弹层
 * @exportName error
 * @param {Object} props 属性对象
 */
function error(config) {
    open(config, 'error');
}

/**
 * 创建帮助提示弹层
 * @exportName help
 * @param {Object} props 属性对象
 */
function help(config) {
    open(config, 'help');
}

/**
 * 创建加载中提示弹层
 * @exportName loading
 * @param {Object} props 属性对象
 */
function loading(config) {
    open(config, 'loading');
}

/**
 * 创建通知提示弹层
 * @exportName notice
 * @param {Object} props 属性对象
 */
function notice(config) {
    open(config, 'notice');
}

export default {
    show: show,
    hide: hide,
    success: success,
    warning: warning,
    error: error,
    help: help,
    loading: loading,
    notice: notice
};