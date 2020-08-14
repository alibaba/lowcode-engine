import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Overlay from '../../overlay';
import { func } from '../../util';
import ConfigProvider from '../../config-provider';
import menu from './menu';

var bindCtx = func.bindCtx;
var getContextProps = ConfigProvider.getContextProps;

var Menu = ConfigProvider.config(menu);

var menuInstance = void 0;

var ContextMenu = (_temp = _class = function (_Component) {
    _inherits(ContextMenu, _Component);

    function ContextMenu(props) {
        _classCallCheck(this, ContextMenu);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            visible: true
        };

        bindCtx(_this, ['handleOverlayClose', 'handleOverlayOpen', 'handleItemClick', 'getOverlay']);
        return _this;
    }

    ContextMenu.prototype.getOverlay = function getOverlay(ref) {
        this.overlay = ref;
    };

    ContextMenu.prototype.close = function close() {
        this.setState({
            visible: false
        });
        menuInstance = null;
    };

    ContextMenu.prototype.handleOverlayClose = function handleOverlayClose(triggerType, e) {
        var clickedPopupMenu = triggerType === 'docClick' && this.popupNodes.some(function (node) {
            return node.contains(e.target);
        });
        if (!clickedPopupMenu) {
            this.close();
            var overlayProps = this.props.overlayProps;

            if (overlayProps && overlayProps.onRequestClose) {
                for (var _len = arguments.length, others = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    others[_key - 2] = arguments[_key];
                }

                overlayProps.onRequestClose.apply(overlayProps, [triggerType, e].concat(others));
            }
        }
    };

    ContextMenu.prototype.handleOverlayOpen = function handleOverlayOpen() {
        this.popupNodes = this.overlay.getInstance().getContent().getInstance().popupNodes;
        var overlayProps = this.props.overlayProps;

        if (overlayProps && overlayProps.onOpen) {
            overlayProps.onOpen();
        }
    };

    ContextMenu.prototype.handleItemClick = function handleItemClick() {
        var _props;

        this.close();

        this.props.onItemClick && (_props = this.props).onItemClick.apply(_props, arguments);
    };

    ContextMenu.prototype.render = function render() {
        var _cx, _cx2;

        var _props2 = this.props,
            className = _props2.className,
            popupClassName = _props2.popupClassName,
            target = _props2.target,
            align = _props2.align,
            offset = _props2.offset,
            afterClose = _props2.afterClose,
            _props2$overlayProps = _props2.overlayProps,
            overlayProps = _props2$overlayProps === undefined ? {} : _props2$overlayProps,
            others = _objectWithoutProperties(_props2, ['className', 'popupClassName', 'target', 'align', 'offset', 'afterClose', 'overlayProps']);

        var contextProps = getContextProps(this.props);
        var prefix = contextProps.prefix;
        var visible = this.state.visible;


        var newOverlayProps = _extends({}, contextProps, overlayProps, {
            target: target,
            align: align,
            offset: offset,
            afterClose: afterClose,
            visible: visible,
            onRequestClose: this.handleOverlayClose,
            onOpen: this.handleOverlayOpen,
            ref: this.getOverlay
        });
        var menuProps = _extends({}, contextProps, {
            triggerType: 'hover'
        }, others, {
            className: cx((_cx = {}, _cx[prefix + 'context'] = true, _cx[className] = !!className, _cx)),
            popupClassName: cx((_cx2 = {}, _cx2[prefix + 'context'] = true, _cx2[popupClassName] = !!popupClassName, _cx2)),
            onItemClick: this.handleItemClick
        });

        newOverlayProps.rtl = false;

        return React.createElement(
            Overlay,
            newOverlayProps,
            React.createElement(Menu, menuProps)
        );
    };

    return ContextMenu;
}(Component), _class.propTypes = {
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    target: PropTypes.any,
    align: PropTypes.string,
    offset: PropTypes.array,
    overlayProps: PropTypes.object,
    afterClose: PropTypes.func,
    mode: PropTypes.oneOf(['inline', 'popup']),
    onOpen: PropTypes.func,
    onItemClick: PropTypes.func
}, _class.defaultProps = {
    prefix: 'next-',
    align: 'tl tl',
    mode: 'popup'
}, _temp);

/**
 * 创建上下文菜单
 * @exportName create
 * @param {Object} props 属性对象
 */

ContextMenu.displayName = 'ContextMenu';
export default function create(props) {
    if (menuInstance) {
        menuInstance.destroy();
    }

    /* eslint-disable no-unused-vars */

    var afterClose = props.afterClose,
        others = _objectWithoutProperties(props, ['afterClose']);
    /* eslint-enable no-unused-vars */

    var div = document.createElement('div');
    document.body.appendChild(div);

    var closeChain = function closeChain() {
        unmountComponentAtNode(div);
        document.body.removeChild(div);

        afterClose && afterClose();
    };

    var newContext = ConfigProvider.getContext();

    var menu = void 0;
    render(React.createElement(
        ConfigProvider,
        newContext,
        React.createElement(ContextMenu, _extends({
            ref: function ref(_ref) {
                menu = _ref;
            },
            afterClose: closeChain
        }, others))
    ), div);

    menuInstance = {
        destroy: function destroy() {
            if (menu) {
                menu.close();
            }
        }
    };

    return menuInstance;
}