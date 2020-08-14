import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from '../menu';
import Icon from '../icon';

/**
 * Nav.SubNav
 * @description 继承自 `Menu.SubMenu` 的能力请查看 `Menu.SubMenu` 文档
 */
var SubNav = (_temp = _class = function (_Component) {
    _inherits(SubNav, _Component);

    function SubNav() {
        _classCallCheck(this, SubNav);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    SubNav.prototype.render = function render() {
        var _classNames;

        var _context = this.context,
            prefix = _context.prefix,
            iconOnly = _context.iconOnly,
            hasArrow = _context.hasArrow,
            mode = _context.mode;

        var _props = this.props,
            className = _props.className,
            icon = _props.icon,
            label = _props.label,
            children = _props.children,
            others = _objectWithoutProperties(_props, ['className', 'icon', 'label', 'children']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'nav-sub-nav-item'] = true, _classNames[className] = !!className, _classNames));
        var iconEl = typeof icon === 'string' ? React.createElement(Icon, { className: prefix + 'nav-icon', type: icon }) : icon;
        if (iconOnly) {
            if (hasArrow) {
                iconEl = React.createElement(Icon, {
                    className: prefix + 'nav-icon-only-arrow',
                    type: mode === 'popup' ? 'arrow-right' : 'arrow-down'
                });
            }
        }
        var newLabel = [iconEl ? cloneElement(iconEl, { key: 'icon' }) : null, React.createElement(
            'span',
            { key: 'label' },
            label
        )];

        return React.createElement(
            Menu.SubMenu,
            _extends({ className: cls, label: newLabel }, others),
            children
        );
    };

    return SubNav;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="your type" />`
     */
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 是否可选
     */
    selectable: PropTypes.bool,
    /**
     * 导航项和子导航
     */
    children: PropTypes.node
}, _class.defaultProps = {
    selectable: false
}, _class.contextTypes = {
    prefix: PropTypes.string,
    mode: PropTypes.string,
    iconOnly: PropTypes.bool,
    hasArrow: PropTypes.bool
}, _temp);
SubNav.displayName = 'SubNav';


export default SubNav;