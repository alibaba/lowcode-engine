import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from './tag';

/**
 * Tag.Closeable
 */
var Closeable = (_temp = _class = function (_Component) {
    _inherits(Closeable, _Component);

    function Closeable() {
        _classCallCheck(this, Closeable);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Closeable.prototype.render = function render() {
        var _props = this.props,
            disabled = _props.disabled,
            className = _props.className,
            closeArea = _props.closeArea,
            onClose = _props.onClose,
            afterClose = _props.afterClose,
            onClick = _props.onClick,
            type = _props.type,
            size = _props.size,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['disabled', 'className', 'closeArea', 'onClose', 'afterClose', 'onClick', 'type', 'size', 'children', 'rtl']);

        return React.createElement(
            Tag,
            _extends({}, others, {
                rtl: rtl,
                disabled: disabled,
                className: className,
                closeArea: closeArea,
                onClose: onClose,
                afterClose: afterClose,
                onClick: onClick,
                type: type,
                size: size,
                closable: true
            }),
            children
        );
    };

    return Closeable;
}(Component), _class.propTypes = {
    disabled: PropTypes.bool,
    className: PropTypes.any,
    /**
     * closeable 标签的 onClose 响应区域, tag: 标签体, tail(默认): 关闭按钮
     */
    closeArea: PropTypes.oneOf(['tag', 'tail']),
    /**
     * 点击关闭按钮时的回调
     * @param {String} from 事件来源, tag: 标签体点击, tail: 关闭按钮点击
     * @returns {Boolean} true则关闭, false阻止关闭
     */
    onClose: PropTypes.func,
    /**
     * 标签关闭后执行的回调
     */
    afterClose: PropTypes.func,
    /**
     * 点击回调
     */
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['normal', 'primary']),
    /**
     * 标签的尺寸（large 尺寸为兼容表单场景 large = medium）
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    children: PropTypes.any,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    disabled: false,
    type: 'normal'
}, _temp);
Closeable.displayName = 'Closeable';


export default Closeable;