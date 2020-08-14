import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import { log } from '../util';

/* eslint-disable */

/** Paragraph */
var Paragraph = (_temp = _class = function (_React$Component) {
    _inherits(Paragraph, _React$Component);

    function Paragraph(props) {
        _classCallCheck(this, Paragraph);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        log.warning('[Paragraph] is deprecated, please use Typography.Paragraph instead!');
        return _this;
    }

    Paragraph.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            type = _props.type,
            size = _props.size,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'type', 'size', 'rtl']);

        var cls = classNames(prefix + 'paragraph', type === 'short' ? prefix + 'paragraph-short' : prefix + 'paragraph-long', size === 'small' ? prefix + 'paragraph-small' : prefix + 'paragraph-medium', className);
        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            'div',
            _extends({}, others, { className: cls }),
            this.props.children
        );
    };

    return Paragraph;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 额外的样式名 会附加到 root dom 上
     */
    className: PropTypes.string,
    /**
     * 什么方式展示段落
     * @enumdesc 展示所有文本, 展示三行以内（非强制）
     */
    type: PropTypes.oneOf(['long', 'short']),
    /**
     * 组件大小。
     * @enumdesc 中号, 小号
     */
    size: PropTypes.oneOf(['medium', 'small']),
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    type: 'long',
    size: 'medium'
}, _temp);
Paragraph.displayName = 'Paragraph';


export default ConfigProvider.config(Paragraph);