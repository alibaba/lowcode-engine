import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Text from './text';

/**
 * Typography.Paragraph
 * @description 继承 Typography.Text 的 API
 * @order 2
 */
var Paragraph = (_temp = _class = function (_React$Component) {
    _inherits(Paragraph, _React$Component);

    function Paragraph() {
        _classCallCheck(this, Paragraph);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Paragraph.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            component = _props.component,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'component']);

        var cls = classNames(prefix + 'typography-paragraph', className);

        return React.createElement(Text, _extends({}, others, { className: cls, component: component }));
    };

    return Paragraph;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType
}, _class.defaultProps = {
    prefix: 'next-',
    type: 'long',
    size: 'medium',
    component: 'p'
}, _temp);
Paragraph.displayName = 'Paragraph';


export default ConfigProvider.config(Paragraph);