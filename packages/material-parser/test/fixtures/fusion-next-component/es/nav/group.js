import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from '../menu';

/**
 * Nav.Group
 * @description 继承自 `Menu.Group` 的能力请查看 `Menu.Group` 文档
 */
var Group = (_temp = _class = function (_Component) {
    _inherits(Group, _Component);

    function Group() {
        _classCallCheck(this, Group);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Group.prototype.render = function render() {
        var _classNames;

        var _context = this.context,
            prefix = _context.prefix,
            iconOnly = _context.iconOnly;

        var _props = this.props,
            className = _props.className,
            children = _props.children,
            label = _props.label,
            others = _objectWithoutProperties(_props, ['className', 'children', 'label']);

        var newLabel = label;
        if (iconOnly) {
            // TODO: add a group icon ?
            newLabel = [React.createElement(
                'span',
                { key: 'label' },
                label
            )];
        }

        var cls = classNames((_classNames = {}, _classNames[prefix + 'nav-group-label'] = true, _classNames[className] = !!className, _classNames));

        return React.createElement(
            Menu.Group,
            _extends({ className: cls, label: newLabel }, others),
            children
        );
    };

    return Group;
}(Component), _class.menuChildType = 'group', _class.propTypes = {
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 导航项和子导航
     */
    children: PropTypes.node
}, _class.contextTypes = {
    prefix: PropTypes.string,
    iconOnly: PropTypes.bool
}, _temp);
Group.displayName = 'Group';


export default Group;