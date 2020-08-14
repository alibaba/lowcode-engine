import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from './text';

/**
 * Typography
 * @description 继承 Typography.Text API
 * @order 0
 */
var Typography = (_temp = _class = function (_Component) {
    _inherits(Typography, _Component);

    function Typography() {
        _classCallCheck(this, Typography);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Typography.prototype.render = function render() {
        return React.createElement(Text, this.props);
    };

    return Typography;
}(Component), _class.propTypes = {
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType
}, _class.defaultProps = {
    component: 'article'
}, _temp);
Typography.displayName = 'Typography';


export default Typography;