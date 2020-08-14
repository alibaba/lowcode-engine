import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';
import { obj } from '../util';

/**
 * Divider
 */
var Divider = (_temp = _class = function (_Component) {
    _inherits(Divider, _Component);

    function Divider() {
        _classCallCheck(this, Divider);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Divider.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            dashed = _props.dashed,
            direction = _props.direction,
            orientation = _props.orientation,
            children = _props.children;

        var others = obj.pickOthers(Divider.propTypes, this.props);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'divider'] = true, _classNames[prefix + 'divider-dashed'] = !!dashed, _classNames[prefix + 'divider-' + direction] = !!direction, _classNames[prefix + 'divider-with-text-' + orientation] = !!orientation && children, _classNames), className);

        return React.createElement(
            'div',
            _extends({ role: 'separator', className: cls }, others),
            children && React.createElement(
                'span',
                { className: prefix + 'divider-inner-text' },
                children
            )
        );
    };

    return Divider;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    /**
     * 是否为虚线
     */
    dashed: PropTypes.bool,
    /**
     * 线是水平还是垂直类型
     */
    direction: PropTypes.oneOf(['hoz', 'ver']),
    /**
     * 分割线标题的位置
     */
    orientation: PropTypes.oneOf(['left', 'right', 'center'])
}, _class.defaultProps = {
    prefix: 'next-',
    direction: 'hoz',
    orientation: 'center',
    dashed: false
}, _temp);
Divider.displayName = 'Divider';


export default ConfigProvider.config(polyfill(Divider));