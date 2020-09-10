import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../icon';
import zhCN from '../locale/zh-cn';
import { obj } from '../util';

var noop = function noop() {};
var pickOthers = obj.pickOthers;
var Inner = (_temp = _class = function (_Component) {
    _inherits(Inner, _Component);

    function Inner() {
        _classCallCheck(this, Inner);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Inner.prototype.renderHeader = function renderHeader() {
        var _cx;

        var _props = this.props,
            prefix = _props.prefix,
            title = _props.title,
            headerStyle = _props.headerStyle;

        var closeLink = this.renderCloseLink();
        var headerCls = cx((_cx = {}, _cx[prefix + 'drawer-header'] = true, _cx[prefix + 'drawer-no-title'] = !title, _cx));

        return React.createElement(
            'div',
            {
                className: headerCls,
                style: headerStyle,
                role: 'heading',
                'aria-level': '1'
            },
            title,
            closeLink
        );
    };

    Inner.prototype.renderBody = function renderBody() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            children = _props2.children,
            bodyStyle = _props2.bodyStyle;

        if (children) {
            return React.createElement(
                'div',
                { className: prefix + 'drawer-body', style: bodyStyle },
                children
            );
        }
        return null;
    };

    Inner.prototype.renderCloseLink = function renderCloseLink() {
        var _props3 = this.props,
            prefix = _props3.prefix,
            closeable = _props3.closeable,
            onClose = _props3.onClose,
            locale = _props3.locale;


        if (closeable) {
            return React.createElement(
                'a',
                {
                    role: 'button',
                    'aria-label': locale.close,
                    className: prefix + 'drawer-close',
                    onClick: onClose
                },
                React.createElement(Icon, {
                    className: prefix + 'drawer-close-icon',
                    type: 'close'
                })
            );
        }

        return null;
    };

    Inner.prototype.render = function render() {
        var _cx2;

        var _props4 = this.props,
            prefix = _props4.prefix,
            className = _props4.className,
            closeable = _props4.closeable,
            placement = _props4.placement,
            role = _props4.role,
            rtl = _props4.rtl;


        var others = pickOthers(Object.keys(Inner.propTypes), this.props);
        var newClassName = cx((_cx2 = {}, _cx2[prefix + 'drawer'] = true, _cx2[prefix + 'drawer-' + placement] = true, _cx2[prefix + 'closeable'] = closeable, _cx2[className] = !!className, _cx2));

        var ariaProps = {
            role: role,
            'aria-modal': 'true'
        };

        var header = this.renderHeader();
        var body = this.renderBody();

        return React.createElement(
            'div',
            _extends({}, ariaProps, {
                className: newClassName
            }, others, {
                dir: rtl ? 'rtl' : undefined
            }),
            React.createElement(
                'div',
                { style: { height: '100%', overflow: 'auto' } },
                header,
                body
            )
        );
    };

    return Inner;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    closeable: PropTypes.bool,
    role: PropTypes.string,
    title: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    rtl: PropTypes.bool,
    onClose: PropTypes.func,
    locale: PropTypes.object,
    headerStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    afterClose: PropTypes.func,
    beforeOpen: PropTypes.func,
    beforeClose: PropTypes.func,
    cache: PropTypes.bool,
    shouldUpdatePosition: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    closeable: true,
    role: 'dialog',
    onClose: noop,
    locale: zhCN.Drawer
}, _temp);
Inner.displayName = 'Inner';
export { Inner as default };