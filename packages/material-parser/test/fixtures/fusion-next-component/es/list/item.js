import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';

/**
 * List.Item
 */
var ListItem = (_temp = _class = function (_Component) {
    _inherits(ListItem, _Component);

    function ListItem() {
        _classCallCheck(this, ListItem);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ListItem.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            title = _props.title,
            description = _props.description,
            media = _props.media,
            extra = _props.extra,
            className = _props.className,
            children = _props.children,
            others = _objectWithoutProperties(_props, ['prefix', 'title', 'description', 'media', 'extra', 'className', 'children']);

        var classes = classNames(prefix + 'list-item', className);

        return React.createElement(
            'li',
            _extends({}, others, { className: classes }),
            media ? React.createElement(
                'div',
                { className: prefix + 'list-item-media' },
                media
            ) : null,
            React.createElement(
                'div',
                { className: prefix + 'list-item-content' },
                title ? React.createElement(
                    'div',
                    { className: prefix + 'list-item-title' },
                    title
                ) : null,
                description ? React.createElement(
                    'div',
                    { className: prefix + 'list-item-description' },
                    description
                ) : null,
                children
            ),
            extra ? React.createElement(
                'div',
                { className: prefix + 'list-item-extra' },
                extra
            ) : null
        );
    };

    return ListItem;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 列表元素的标题
     */
    title: PropTypes.node,
    /**
     * 列表元素的描述内容
     */
    description: PropTypes.node,
    /**
     * 列表元素的头像 / 图标 / 图片内容
     */
    media: PropTypes.node,
    /**
     * 额外内容
     */
    extra: PropTypes.node,
    className: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-'
}, _temp);
ListItem.displayName = 'ListItem';


export default ConfigProvider.config(polyfill(ListItem));