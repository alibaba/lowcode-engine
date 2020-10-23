import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Card.Actions
 * @order 5
 */
var CardActions = (_temp = _class = function (_Component) {
    _inherits(CardActions, _Component);

    function CardActions() {
        _classCallCheck(this, CardActions);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    CardActions.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            Component = _props.component,
            className = _props.className,
            others = _objectWithoutProperties(_props, ['prefix', 'component', 'className']);

        return React.createElement(Component, _extends({}, others, {
            className: classNames(prefix + 'card-actions', className)
        }));
    };

    return CardActions;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div'
}, _temp);
CardActions.displayName = 'CardActions';


export default ConfigProvider.config(CardActions);