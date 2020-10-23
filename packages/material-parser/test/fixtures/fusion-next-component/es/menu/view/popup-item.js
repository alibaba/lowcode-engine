import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import Overlay from '../../overlay';
import { func, obj, dom } from '../../util';
import Item from './item';
import SelectableItem from './selectable-item';

var bindCtx = func.bindCtx;
var setStyle = dom.setStyle;

var Popup = Overlay.Popup;

/**
 * Menu.PopupItem
 * @order 2
 */
var PopupItem = (_temp = _class = function (_Component) {
    _inherits(PopupItem, _Component);

    function PopupItem(props) {
        _classCallCheck(this, PopupItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        bindCtx(_this, ['handleOpen', 'handlePopupOpen', 'handlePopupClose', 'getPopup']);
        return _this;
    }

    PopupItem.prototype.getPopup = function getPopup(ref) {
        this.popup = ref;
    };

    PopupItem.prototype.getOpen = function getOpen() {
        var _props = this.props,
            _key = _props._key,
            root = _props.root;
        var openKeys = root.state.openKeys;


        return openKeys.indexOf(_key) > -1;
    };

    PopupItem.prototype.getChildSelected = function getChildSelected() {
        var _props2 = this.props,
            _key = _props2._key,
            root = _props2.root;
        var selectMode = root.props.selectMode;
        var selectedKeys = root.state.selectedKeys;


        var _keyPos = root.k2n[_key].pos;

        return !!selectMode && selectedKeys.some(function (key) {
            return root.k2n[key] && root.k2n[key].pos.indexOf(_keyPos) === 0;
        });
    };

    PopupItem.prototype.getPopupProps = function getPopupProps() {
        var popupProps = this.props.root.props.popupProps;

        if (typeof popupProps === 'function') {
            popupProps = popupProps(this.props);
        }
        return popupProps;
    };

    PopupItem.prototype.handleOpen = function handleOpen(open, triggerType, e) {
        var _props3 = this.props,
            _key = _props3._key,
            root = _props3.root;

        root.handleOpen(_key, open, triggerType, e);

        var popupProps = this.popupProps;
        popupProps.onVisibleChange && popupProps.onVisibleChange(open, triggerType, e);
    };

    PopupItem.prototype.handlePopupOpen = function handlePopupOpen() {
        var _props4 = this.props,
            root = _props4.root,
            level = _props4.level,
            align = _props4.align,
            autoWidth = _props4.autoWidth;
        var _root$props = root.props,
            rootPopupAutoWidth = _root$props.popupAutoWidth,
            rootPopupAlign = _root$props.popupAlign,
            direction = _root$props.direction;

        var popupAlign = align || rootPopupAlign;
        var popupAutoWidth = 'autoWidth' in this.props ? autoWidth : rootPopupAutoWidth;
        var itemNode = findDOMNode(this);
        var menuNode = itemNode.parentNode;
        this.popupNode = this.popup.getInstance().overlay.getInstance().getContentNode();
        root.popupNodes.push(this.popupNode);

        if (popupAutoWidth) {
            var targetNode = direction === 'hoz' && level === 1 ? itemNode : menuNode;

            if (targetNode.offsetWidth > this.popupNode.offsetWidth) {
                setStyle(this.popupNode, 'width', targetNode.offsetWidth + 'px');
            }
        }
        if (popupAlign === 'outside' && !(direction === 'hoz' && level === 1)) {
            setStyle(this.popupNode, 'height', menuNode.offsetHeight + 'px');
            setStyle(this.popupNode, 'overflow-y', 'scroll');
        }
        // removeClass(this.popupNode, `${prefix}hide`);

        var popupProps = this.popupProps;
        popupProps.onOpen && popupProps.onOpen();
    };

    PopupItem.prototype.handlePopupClose = function handlePopupClose() {
        var root = this.props.root;

        var popupNodes = root.popupNodes;
        var index = popupNodes.indexOf(this.popupNode);
        index > -1 && popupNodes.splice(index, 1);

        var popupProps = this.popupProps;
        popupProps.onClose && popupProps.onClose();
    };

    PopupItem.prototype.renderItem = function renderItem(selectable, children, others) {
        var _cx;

        var _props5 = this.props,
            _key = _props5._key,
            root = _props5.root,
            level = _props5.level,
            inlineLevel = _props5.inlineLevel,
            label = _props5.label,
            className = _props5.className;
        var prefix = root.props.prefix;

        var NewItem = selectable ? SelectableItem : Item;
        var open = this.getOpen();
        var isChildSelected = this.getChildSelected();

        var itemProps = {
            'aria-haspopup': true,
            'aria-expanded': open,
            _key: _key,
            root: root,
            level: level,
            inlineLevel: inlineLevel,
            type: 'submenu'
        };

        itemProps.className = cx((_cx = {}, _cx[prefix + 'opened'] = open, _cx[prefix + 'child-selected'] = isChildSelected, _cx[className] = !!className, _cx));

        return React.createElement(
            NewItem,
            _extends({}, itemProps, others),
            React.createElement(
                'span',
                { className: prefix + 'menu-item-text' },
                label
            ),
            children
        );
    };

    PopupItem.prototype.renderPopup = function renderPopup(trigger, triggerType, positionProps, children) {
        var _this2 = this;

        var _props6 = this.props,
            root = _props6.root,
            level = _props6.level,
            selectable = _props6.selectable;
        var direction = root.props.direction;

        this.popupProps = this.getPopupProps();
        var open = this.getOpen();

        if (direction === 'hoz' && level === 1 && selectable) {
            positionProps.target = function () {
                return findDOMNode(_this2);
            };
        }

        return React.createElement(
            Popup,
            _extends({
                ref: this.getPopup
            }, positionProps, this.popupProps, {
                canCloseByEsc: false,
                trigger: trigger,
                triggerType: triggerType,
                visible: open,
                onVisibleChange: this.handleOpen,
                onOpen: this.handlePopupOpen,
                onClose: this.handlePopupClose
            }),
            children
        );
    };

    PopupItem.prototype.render = function render() {
        var _this3 = this;

        var _props7 = this.props,
            root = _props7.root,
            level = _props7.level,
            hasSubMenu = _props7.hasSubMenu,
            selectableFromProps = _props7.selectable,
            children = _props7.children,
            triggerType = _props7.triggerType,
            align = _props7.align,
            noIcon = _props7.noIcon,
            rtl = _props7.rtl;

        var others = obj.pickOthers(Object.keys(PopupItem.propTypes), this.props);
        var _root$props2 = root.props,
            prefix = _root$props2.prefix,
            selectMode = _root$props2.selectMode,
            direction = _root$props2.direction,
            rootPopupAlign = _root$props2.popupAlign,
            rootTriggerType = _root$props2.triggerType;

        var popupAlign = align || rootPopupAlign;
        var newTriggerType = triggerType || (hasSubMenu ? rootTriggerType : 'hover');
        var newChildren = Array.isArray(children) ? children[0] : children;
        // let newChildren = Array.isArray(children) ? children[0] : children;
        // newChildren = cloneElement(newChildren, {
        //     className: cx({
        //         [`${prefix}menu-popup-content`]: true,
        //         [newChildren.props.className]: !!newChildren.props.className,
        //         [`${prefix}hide`]: popupAutoWidth || popupAlign === 'outside'
        //     })
        // });
        var selectable = selectMode && selectableFromProps;
        var triggerIsIcon = selectable && newTriggerType === 'click';
        var open = this.getOpen();

        var positionProps = {};
        var arrowProps = void 0;

        if (direction === 'hoz' && level === 1) {
            var _cx2;

            positionProps.align = 'tl bl';
            positionProps.offset = [0, 0];

            arrowProps = {
                type: 'arrow-down',
                className: cx((_cx2 = {}, _cx2[prefix + 'menu-hoz-icon-arrow'] = true, _cx2[prefix + 'open'] = open, _cx2))
            };
        } else {
            if (popupAlign === 'outside') {
                positionProps.target = function () {
                    return findDOMNode(root);
                };
                positionProps.align = 'tl tr';

                rtl ? positionProps.offset = [-2, 0] : positionProps.offset = [2, 0];
            } else {
                if (triggerIsIcon) {
                    positionProps.target = function () {
                        return findDOMNode(_this3);
                    };
                }
                positionProps.align = 'tl tr';

                rtl ? positionProps.offset = [2, -8] : positionProps.offset = [-2, -8];
            }

            arrowProps = {
                type: 'arrow-right',
                className: prefix + 'menu-icon-arrow'
            };
        }

        var arrow = React.createElement(Icon, arrowProps);
        var trigger = triggerIsIcon ? arrow : this.renderItem(selectable, noIcon ? null : arrow, others);
        var popup = this.renderPopup(trigger, newTriggerType, positionProps, newChildren);
        return triggerIsIcon ? this.renderItem(selectable, popup, others) : popup;
    };

    return PopupItem;
}(Component), _class.menuChildType = 'submenu', _class.propTypes = {
    _key: PropTypes.string,
    root: PropTypes.object,
    level: PropTypes.number,
    hasSubMenu: PropTypes.bool,
    noIcon: PropTypes.bool,
    rtl: PropTypes.bool,
    selectable: PropTypes.bool,
    /**
     * 标签内容
     */
    label: PropTypes.node,
    /**
     * 自定义弹层内容
     */
    children: PropTypes.node,
    className: PropTypes.string,
    triggerType: PropTypes.oneOf(['click', 'hover']),
    align: PropTypes.oneOf(['outside', 'follow']),
    autoWidth: PropTypes.bool
}, _class.defaultProps = {
    selectable: false,
    noIcon: false
}, _temp);
PopupItem.displayName = 'PopupItem';
export { PopupItem as default };