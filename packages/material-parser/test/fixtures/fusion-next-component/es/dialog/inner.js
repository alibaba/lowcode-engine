import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../button';
import Icon from '../icon';
import zhCN from '../locale/zh-cn';
import { func, obj, guid } from '../util';

var makeChain = func.makeChain;
var pickOthers = obj.pickOthers;

var noop = function noop() {};

var Inner = (_temp = _class = function (_Component) {
    _inherits(Inner, _Component);

    function Inner() {
        _classCallCheck(this, Inner);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Inner.prototype.getNode = function getNode(name, ref) {
        this[name] = ref;
    };

    Inner.prototype.renderHeader = function renderHeader() {
        var _props = this.props,
            prefix = _props.prefix,
            title = _props.title;

        if (title) {
            this.titleId = guid('dialog-title-');
            return React.createElement(
                'div',
                {
                    className: prefix + 'dialog-header',
                    id: this.titleId,
                    ref: this.getNode.bind(this, 'headerNode'),
                    role: 'heading',
                    'aria-level': '1'
                },
                title
            );
        }
        return null;
    };

    Inner.prototype.renderBody = function renderBody() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            children = _props2.children;

        if (children) {
            return React.createElement(
                'div',
                {
                    className: prefix + 'dialog-body',
                    ref: this.getNode.bind(this, 'bodyNode')
                },
                children
            );
        }
        return null;
    };

    Inner.prototype.renderFooter = function renderFooter() {
        var _cx,
            _this2 = this;

        var _props3 = this.props,
            prefix = _props3.prefix,
            footer = _props3.footer,
            footerAlign = _props3.footerAlign,
            footerActions = _props3.footerActions,
            locale = _props3.locale,
            height = _props3.height;


        if (footer === false) {
            return null;
        }

        var newClassName = cx((_cx = {}, _cx[prefix + 'dialog-footer'] = true, _cx[prefix + 'align-' + footerAlign] = true, _cx[prefix + 'dialog-footer-fixed-height'] = !!height, _cx));
        var footerContent = footer === true || !footer ? footerActions.map(function (action) {
            var btnProps = _this2.props[action + 'Props'];
            var newBtnProps = _extends({}, btnProps, {
                prefix: prefix,
                className: cx(prefix + 'dialog-btn', btnProps.className),
                onClick: makeChain(_this2.props['on' + (action[0].toUpperCase() + action.slice(1))], btnProps.onClick),
                children: btnProps.children || locale[action]
            });
            if (action === 'ok') {
                newBtnProps.type = 'primary';
            }

            return React.createElement(Button, _extends({ key: action }, newBtnProps));
        }) : footer;

        return React.createElement(
            'div',
            {
                className: newClassName,
                ref: this.getNode.bind(this, 'footerNode')
            },
            footerContent
        );
    };

    Inner.prototype.renderCloseLink = function renderCloseLink() {
        var _props4 = this.props,
            prefix = _props4.prefix,
            closeable = _props4.closeable,
            onClose = _props4.onClose,
            locale = _props4.locale;


        if (closeable) {
            return React.createElement(
                'a',
                {
                    role: 'button',
                    'aria-label': locale.close,
                    className: prefix + 'dialog-close',
                    onClick: onClose
                },
                React.createElement(Icon, {
                    className: prefix + 'dialog-close-icon',
                    type: 'close'
                })
            );
        }

        return null;
    };

    Inner.prototype.render = function render() {
        var _cx2;

        var _props5 = this.props,
            prefix = _props5.prefix,
            className = _props5.className,
            closeable = _props5.closeable,
            title = _props5.title,
            role = _props5.role,
            rtl = _props5.rtl,
            height = _props5.height;

        var others = pickOthers(Object.keys(Inner.propTypes), this.props);
        var newClassName = cx((_cx2 = {}, _cx2[prefix + 'dialog'] = true, _cx2[prefix + 'closeable'] = closeable, _cx2[className] = !!className, _cx2));

        var header = this.renderHeader();
        var body = this.renderBody();
        var footer = this.renderFooter();
        var closeLink = this.renderCloseLink();

        var ariaProps = {
            role: role,
            'aria-modal': 'true'
        };
        if (title) {
            ariaProps['aria-labelledby'] = this.titleId;
        }

        others.style = _extends({}, others.style, { height: height });

        return React.createElement(
            'div',
            _extends({}, ariaProps, {
                className: newClassName
            }, others, {
                dir: rtl ? 'rtl' : undefined
            }),
            header,
            body,
            footer,
            closeLink
        );
    };

    return Inner;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.node,
    children: PropTypes.node,
    footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
    footerAlign: PropTypes.oneOf(['left', 'center', 'right']),
    footerActions: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    okProps: PropTypes.object,
    cancelProps: PropTypes.object,
    closeable: PropTypes.bool,
    onClose: PropTypes.func,
    locale: PropTypes.object,
    role: PropTypes.string,
    rtl: PropTypes.bool,
    // set value for a fixed height dialog. Passing a value will absolutely position the footer to the bottom.
    height: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    footerAlign: 'right',
    footerActions: ['ok', 'cancel'],
    onOk: noop,
    onCancel: noop,
    okProps: {},
    cancelProps: {},
    closeable: true,
    onClose: noop,
    locale: zhCN.Dialog,
    role: 'dialog'
}, _temp);
Inner.displayName = 'Inner';
export { Inner as default };