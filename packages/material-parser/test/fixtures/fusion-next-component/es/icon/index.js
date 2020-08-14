import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import createFromIconfontCN from './icon-font';
import { obj } from '../util';
/**
 * Icon
 */
var Icon = (_temp = _class = function (_Component) {
    _inherits(Icon, _Component);

    function Icon() {
        _classCallCheck(this, Icon);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Icon.prototype.render = function render() {
        var _cx;

        /* eslint-disable no-unused-vars*/
        var _props = this.props,
            prefix = _props.prefix,
            type = _props.type,
            size = _props.size,
            className = _props.className,
            rtl = _props.rtl,
            style = _props.style,
            children = _props.children;

        var others = obj.pickOthers(_extends({}, Icon.propTypes), this.props);

        var classes = cx((_cx = {}, _cx[prefix + 'icon'] = true, _cx[prefix + 'icon-' + type] = !!type, _cx['' + prefix + size] = !!size && typeof size === 'string', _cx[className] = !!className, _cx));

        if (rtl && ['arrow-left', 'arrow-right', 'arrow-double-left', 'arrow-double-right', 'switch', 'sorting', 'descending', 'ascending'].indexOf(type) !== -1) {
            others.dir = 'rtl';
        }

        var sizeStyle = typeof size === 'number' ? {
            width: size,
            height: size,
            lineHeight: size + 'px',
            fontSize: size
        } : {};

        return React.createElement(
            'i',
            _extends({}, others, {
                style: _extends({}, sizeStyle, style),
                className: classes
            }),
            children
        );
    };

    return Icon;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * 指定显示哪种图标
     */
    type: PropTypes.string,
    children: PropTypes.node,
    /**
     * 指定图标大小
     * <br/>**可选值**<br/> xxs, xs, small, medium, large, xl, xxl, xxxl, inherit
     */
    size: PropTypes.oneOfType([PropTypes.oneOf(['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'inherit']), PropTypes.number]),
    className: PropTypes.string,
    style: PropTypes.object
}), _class.defaultProps = {
    prefix: 'next-',
    size: 'medium'
}, _class._typeMark = 'icon', _temp);
Icon.displayName = 'Icon';


Icon.createFromIconfontCN = createFromIconfontCN;
export default ConfigProvider.config(Icon);