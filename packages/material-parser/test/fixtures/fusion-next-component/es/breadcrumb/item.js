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
 * Breadcrumb.Item
 */
var Item = (_temp = _class = function (_Component) {
    _inherits(Item, _Component);

    function Item() {
        _classCallCheck(this, Item);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    // stateless separator component
    Item.Separator = function Separator(_ref) {
        var prefix = _ref.prefix,
            children = _ref.children;

        return React.createElement(
            'span',
            { className: prefix + 'breadcrumb-separator' },
            children
        );
    };

    Item.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            rtl = _props.rtl,
            className = _props.className,
            children = _props.children,
            link = _props.link,
            activated = _props.activated,
            separator = _props.separator,
            others = _objectWithoutProperties(_props, ['prefix', 'rtl', 'className', 'children', 'link', 'activated', 'separator']);

        var clazz = classNames(prefix + 'breadcrumb-text', className, {
            activated: activated
        });

        return React.createElement(
            'li',
            { dir: rtl ? 'rtl' : null, className: prefix + 'breadcrumb-item' },
            link ? React.createElement(
                'a',
                _extends({ href: link, className: clazz }, others),
                children
            ) : React.createElement(
                'span',
                _extends({ className: clazz }, others),
                children
            ),
            activated ? null : Item.Separator({ prefix: prefix, children: separator })
        );
    };

    return Item;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 面包屑节点链接，如果设置这个属性，则该节点为`<a />` ，否则是`<span />`
     */
    link: PropTypes.string,
    activated: PropTypes.bool,
    separator: PropTypes.node,
    className: PropTypes.any,
    children: PropTypes.node
}, _class.defaultProps = {
    prefix: 'next-'
}, _class._typeMark = 'breadcrumb_item', _temp);
Item.displayName = 'Item';


export default ConfigProvider.config(Item);