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
 * Nav.PopupItem
 * @description 继承自 `Menu.PopupItem` 的能力请查看 `Menu.PopupItem` 文档
 */
var PopupItem = (_temp = _class = function (_Component) {
    _inherits(PopupItem, _Component);

    function PopupItem() {
        _classCallCheck(this, PopupItem);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    PopupItem.prototype.render = function render() {
        var _classNames;

        var _context = this.context,
            prefix = _context.prefix,
            iconOnly = _context.iconOnly,
            hasArrow = _context.hasArrow;

        var _props = this.props,
            className = _props.className,
            icon = _props.icon,
            label = _props.label,
            children = _props.children,
            others = _objectWithoutProperties(_props, ['className', 'icon', 'label', 'children']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'nav-popup-item'] = true, _classNames[className] = !!className, _classNames));
        var iconEl = typeof icon === 'string' ? React.createElement(Icon, { className: prefix + 'nav-icon', type: icon }) : icon;
        if (iconOnly) {
            if (hasArrow) {
                iconEl = React.createElement(Icon, {
                    className: prefix + 'nav-icon-only-arrow',
                    type: 'arrow-right'
                });
            }
        }
        var newLabel = [iconEl ? cloneElement(iconEl, { key: 'icon' }) : null, React.createElement(
            'span',
            { key: 'label' },
            label
        )];

        return React.createElement(
            Menu.PopupItem,
            _extends({ className: cls, label: newLabel }, others),
            children
        );
    };

    return PopupItem;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 自定义图标，可以使用 Icon 的 type, 也可以使用组件 `<Icon type="icon type" />`
     */
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 弹出内容
     */
    children: PropTypes.node
}, _class.contextTypes = {
    prefix: PropTypes.string,
    iconOnly: PropTypes.bool,
    hasArrow: PropTypes.bool
}, _temp);
PopupItem.displayName = 'PopupItem';


export default PopupItem;