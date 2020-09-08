import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';

/**
 * List
 */
var List = (_temp = _class = function (_Component) {
    _inherits(List, _Component);

    function List() {
        _classCallCheck(this, List);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    List.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            header = _props.header,
            footer = _props.footer,
            size = _props.size,
            divider = _props.divider,
            className = _props.className,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'header', 'footer', 'size', 'divider', 'className', 'children', 'rtl']);

        if (rtl) {
            others.dir = 'rtl';
        }

        var classes = classNames(prefix + 'list', (_classNames = {}, _classNames[prefix + 'list-small'] = size === 'small', _classNames[prefix + 'list-divider'] = divider, _classNames), className);

        return React.createElement(
            'div',
            _extends({}, others, { className: classes }),
            header ? React.createElement(
                'div',
                { className: prefix + 'list-header' },
                header
            ) : null,
            React.createElement(
                'ul',
                { className: prefix + 'list-items' },
                children
            ),
            footer ? React.createElement(
                'div',
                { className: prefix + 'list-footer' },
                footer
            ) : null
        );
    };

    return List;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 列表头部
     */
    header: PropTypes.node,
    /**
     * 列表尾部
     */
    footer: PropTypes.node,
    /**
     * 列表尺寸
     */
    size: PropTypes.oneOf(['medium', 'small']),
    /**
     * 是否显示分割线
     */
    divider: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.any
}, _class.defaultProps = {
    rtl: false,
    size: 'medium',
    divider: true,
    prefix: 'next-'
}, _temp);
List.displayName = 'List';


export default ConfigProvider.config(polyfill(List));