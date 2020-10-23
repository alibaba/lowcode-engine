import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

var Group = (_temp = _class = function (_Component) {
    _inherits(Group, _Component);

    function Group() {
        _classCallCheck(this, Group);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Group.prototype.render = function render() {
        var _props = this.props,
            className = _props.className,
            prefix = _props.prefix,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['className', 'prefix', 'children', 'rtl']);

        var clazz = classNames((prefix || 'next-') + 'tag-group', className);

        return React.createElement(
            'div',
            _extends({ className: clazz, dir: rtl ? 'rtl' : undefined }, others),
            children
        );
    };

    return Group;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.any,
    children: PropTypes.node,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    rtl: false
}, _temp);
Group.displayName = 'Group';


export default Group;