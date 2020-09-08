import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';
/**
 * Typography.Text
 * @order 3
 */
var Text = (_temp = _class = function (_Component) {
    _inherits(Text, _Component);

    function Text() {
        _classCallCheck(this, Text);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Text.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            component = _props.component,
            strong = _props.strong,
            underline = _props.underline,
            deleteProp = _props.delete,
            code = _props.code,
            mark = _props.mark,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'component', 'strong', 'underline', 'delete', 'code', 'mark', 'rtl']);

        var Tag = component;
        var children = this.props.children;

        if (strong) {
            children = React.createElement(
                'strong',
                null,
                children
            );
        }

        if (underline) {
            children = React.createElement(
                'u',
                null,
                children
            );
        }

        if (deleteProp) {
            children = React.createElement(
                'del',
                null,
                children
            );
        }

        if (code) {
            children = React.createElement(
                'code',
                null,
                children
            );
        }

        if (mark) {
            children = React.createElement(
                'mark',
                null,
                children
            );
        }

        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            Tag,
            _extends({}, others, {
                className: (className || '') + ' ' + prefix + 'typography'
            }),
            children
        );
    };

    return Text;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 添加删除线样式
     */
    delete: PropTypes.bool,
    /**
     * 添加标记样式
     */
    mark: PropTypes.bool,
    /**
     * 添加下划线样式
     */
    underline: PropTypes.bool,
    /**
     * 是否加粗
     */
    strong: PropTypes.bool,
    /**
     * 添加代码样式
     */
    code: PropTypes.bool,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType,
    children: PropTypes.node,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    delete: false,
    mark: false,
    underline: false,
    strong: false,
    code: false,
    component: 'span',
    rtl: false
}, _temp);
Text.displayName = 'Text';


export default ConfigProvider.config(Text);