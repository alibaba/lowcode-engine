import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from './text';
import ConfigProvider from '../config-provider';

export default (function (Tag) {
    var _class, _temp;

    /**
     * Typography.Title
     * @description 分为 H1, H2, H3, H4, H5, H6 不同的组件，表示不同层级，继承 Typography.Text API
     * @order 1
     */
    var Title = (_temp = _class = function (_Component) {
        _inherits(Title, _Component);

        function Title() {
            _classCallCheck(this, Title);

            return _possibleConstructorReturn(this, _Component.apply(this, arguments));
        }

        Title.prototype.render = function render() {
            var _props = this.props,
                prefix = _props.prefix,
                className = _props.className,
                others = _objectWithoutProperties(_props, ['prefix', 'className']);

            return React.createElement(Text, _extends({}, others, {
                component: Tag,
                className: (className || '') + ' ' + prefix + 'typography-title'
            }));
        };

        return Title;
    }(Component), _class.propTypes = {
        prefix: PropTypes.string
    }, _class.defaultProps = {
        prefix: 'next-'
    }, _temp);
    Title.displayName = 'Title';


    Title.displayName = Tag.toUpperCase();
    return ConfigProvider.config(Title);
});