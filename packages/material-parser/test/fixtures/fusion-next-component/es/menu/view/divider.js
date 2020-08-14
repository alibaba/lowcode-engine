import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/**
 * Menu.Divider
 * @order 6
 */
var Divider = (_temp = _class = function (_Component) {
    _inherits(Divider, _Component);

    function Divider() {
        _classCallCheck(this, Divider);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Divider.prototype.render = function render() {
        var _cx;

        var _props = this.props,
            root = _props.root,
            className = _props.className,
            others = _objectWithoutProperties(_props, ['root', 'className']);

        var prefix = root.props.prefix;


        var newClassName = cx((_cx = {}, _cx[prefix + 'menu-divider'] = true, _cx[className] = !!className, _cx));

        return React.createElement('li', _extends({ role: 'separator', className: newClassName }, others));
    };

    return Divider;
}(Component), _class.menuChildType = 'divider', _class.propTypes = {
    root: PropTypes.object,
    className: PropTypes.string
}, _temp);
Divider.displayName = 'Divider';
export { Divider as default };