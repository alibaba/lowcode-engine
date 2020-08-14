import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React, { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SubMenu from './sub-menu';
import ConfigProvider from '../../config-provider';
import { func, obj, dom, events, KEYCODE } from '../../util';
import { getWidth } from './util';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers,
    isNil = obj.isNil;

var noop = function noop() {};
var MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';

/**
 * Menu
 */
var Menu = (_temp = _class = function (_Component) {
    _inherits(Menu, _Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _initialiseProps.call(_this);

        var _this$props = _this.props,
            children = _this$props.children,
            selectedKeys = _this$props.selectedKeys,
            defaultSelectedKeys = _this$props.defaultSelectedKeys,
            focusedKey = _this$props.focusedKey,
            focusable = _this$props.focusable,
            autoFocus = _this$props.autoFocus,
            hozInLine = _this$props.hozInLine;


        _this.state = {
            lastVisibleIndex: undefined
        };

        _this.newChildren = _this.getNewChildren({ children: children, hozInLine: hozInLine });

        if (focusable) {
            _this.tabbableKey = _this.getFirstAvaliablelChildKey('0');
        }

        _this.state = {
            lastVisibleIndex: undefined,
            openKeys: _this.getInitOpenKeys(props),
            selectedKeys: _this.normalizeToArray(selectedKeys || defaultSelectedKeys),
            focusedKey: !isNil(_this.props.focusedKey) ? focusedKey : focusable && autoFocus ? _this.tabbableKey : null
        };

        bindCtx(_this, ['handleOpen', 'handleSelect', 'handleItemClick', 'handleItemKeyDown', 'onBlur', 'adjustChildrenWidth']);

        _this.popupNodes = [];
        return _this;
    }

    Menu.prototype.componentDidMount = function componentDidMount() {
        this.menuNode = findDOMNode(this);

        this.adjustChildrenWidth();

        if (this.props.hozInLine) {
            events.on(window, 'resize', this.adjustChildrenWidth);
        }
    };

    Menu.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var state = {};

        if ('openKeys' in nextProps) {
            state.openKeys = this.normalizeToArray(nextProps.openKeys);
        }
        if ('selectedKeys' in nextProps) {
            state.selectedKeys = this.normalizeToArray(nextProps.selectedKeys);
        }
        if ('focusedKey' in nextProps) {
            state.focusedKey = nextProps.focusedKey;
        }

        if (Object.keys(state).length) {
            this.setState(state);
        }
    };

    Menu.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
        if (this.state.lastVisibleIndex !== nextState.lastVisibleIndex) {
            this.adjustChildrenWidth();
        }

        this.newChildren = this.getNewChildren(nextProps);

        if (this.props.focusable) {
            if (this.tabbableKey in this.k2n) {
                if (this.state.focusedKey) {
                    this.tabbableKey = this.state.focusedKey;
                }
            } else {
                this.tabbableKey = this.getFirstAvaliablelChildKey('0');
            }
        }
    };

    Menu.prototype.componentWillUnmount = function componentWillUnmount() {
        events.off(window, 'resize', this.adjustChildrenWidth);
    };

    Menu.prototype.adjustChildrenWidth = function adjustChildrenWidth() {
        var _props = this.props,
            direction = _props.direction,
            prefix = _props.prefix,
            header = _props.header,
            footer = _props.footer,
            hozInLine = _props.hozInLine;

        if (direction !== 'hoz' || !hozInLine) {
            return;
        }

        if (!this.menuNode && !this.menuContent) {
            return;
        }

        var children = [],
            spaceWidth = void 0;

        if (header || footer) {
            children = this.menuContent.children;
            spaceWidth = getWidth(this.menuNode) - getWidth(this.menuHeader) - getWidth(this.menuFooter);
        } else {
            children = this.menuNode.children;
            spaceWidth = getWidth(this.menuNode);
        }

        if (children.length < 2) {
            return;
        }

        var currentSumWidth = 0,
            lastVisibleIndex = -1;

        var menuItemNodes = [].slice.call(children).filter(function (node) {
            return node.className.split(' ').indexOf(prefix + 'menu-more') < 0;
        });

        var overflowedItems = menuItemNodes.filter(function (c) {
            return c.className.split(' ').indexOf(MENUITEM_OVERFLOWED_CLASSNAME) >= 0;
        });

        overflowedItems.forEach(function (c) {
            dom.setStyle(c, 'display', 'inline-block');
        });

        var lastIndicator = children[children.length - 1];
        dom.setStyle(lastIndicator, 'display', 'inline-block');
        var moreWidth = getWidth(lastIndicator);
        dom.setStyle(lastIndicator, 'display', 'none');

        this.menuItemSizes = menuItemNodes.map(function (c) {
            return getWidth(c);
        });

        overflowedItems.forEach(function (c) {
            dom.setStyle(c, 'display', 'none');
        });

        this.menuItemSizes.forEach(function (liWidth) {
            currentSumWidth += liWidth;
            if (currentSumWidth + moreWidth <= spaceWidth) {
                lastVisibleIndex++;
            }
        });

        this.setState({
            lastVisibleIndex: lastVisibleIndex
        });
    };

    Menu.prototype.onBlur = function onBlur(e) {
        this.setState({
            focusedKey: undefined
        });

        this.props.onBlur && this.props.onBlur(e);
    };

    Menu.prototype.getInitOpenKeys = function getInitOpenKeys(props) {
        var _this2 = this;

        var initOpenKeys = void 0;

        var openKeys = props.openKeys,
            defaultOpenKeys = props.defaultOpenKeys,
            defaultOpenAll = props.defaultOpenAll,
            mode = props.mode,
            openMode = props.openMode;

        if (openKeys) {
            initOpenKeys = openKeys;
        } else if (defaultOpenAll && mode === 'inline' && openMode === 'multiple') {
            initOpenKeys = Object.keys(this.k2n).filter(function (key) {
                return _this2.k2n[key].type === 'submenu';
            });
        } else {
            initOpenKeys = defaultOpenKeys;
        }

        return this.normalizeToArray(initOpenKeys);
    };

    Menu.prototype.getIndicatorsItem = function getIndicatorsItem(items, isPlaceholder) {
        var _cx;

        var _props2 = this.props,
            prefix = _props2.prefix,
            renderMore = _props2.renderMore;

        var moreCls = cx((_cx = {}, _cx[prefix + 'menu-more'] = true, _cx));

        var style = {};
        // keep placehold to get width
        if (isPlaceholder) {
            style.visibility = 'hidden';
            style.display = 'inline-block';
            // indicators which not in use, just display: none
        } else if (items && items.length === 0) {
            style.display = 'none';
            style.visibility = 'unset';
        }

        if (renderMore && typeof renderMore === 'function') {
            return React.cloneElement(renderMore(items), {
                style: style
            });
        }

        return React.createElement(
            SubMenu,
            { label: '\xB7\xB7\xB7', noIcon: true, className: moreCls, style: style },
            items
        );
    };

    Menu.prototype.getNewChildren = function getNewChildren(_ref) {
        var _this3 = this;

        var children = _ref.children,
            hozInLine = _ref.hozInLine;

        this.k2n = {};
        this.p2n = {};

        var arr = [];

        if (hozInLine) {
            arr = this.addIndicators(children);
        } else {
            arr = children;
        }

        var loop = function loop(children, posPrefix) {
            var indexWrapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { index: 0 };
            var inlineLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

            var keyArray = [];
            return Children.map(children, function (child) {
                if (child && (typeof child.type === 'function' ||
                // `React.forwardRef(render)` returns a forwarding
                // object that includes `render` method, and the specific
                // `child.type` will be an object instead of a class or
                // function.
                _typeof(child.type) === 'object') && 'menuChildType' in child.type) {
                    var newChild = void 0;

                    var pos = void 0;
                    var props = { root: _this3 };

                    if (['item', 'submenu', 'group'].indexOf(child.type.menuChildType) > -1) {
                        pos = posPrefix + '-' + indexWrapper.index++;
                        var key = typeof child.key === 'string' ? child.key : pos;

                        // filter out duplicate keys
                        if (keyArray.indexOf(key) > -1) {
                            return;
                        }

                        keyArray.push(key);

                        var level = pos.split('-').length - 1;
                        _this3.k2n[key] = _this3.p2n[pos] = {
                            key: key,
                            pos: pos,
                            mode: child.props.mode,
                            type: child.type.menuChildType,
                            disabled: child.props.disabled,
                            label: child.props.label || child.props.children
                        };

                        props.level = level;
                        props.inlineLevel = inlineLevel;
                        props._key = key;
                        props.groupIndent = child.type.menuChildType === 'group' ? 1 : 0;
                    }

                    // paddingLeft(or paddingRight in rtl) only make sense in inline mode
                    // parent know children's inlineLevel
                    // if parent's mode is popup, then children's inlineLevel must be 1;
                    // else inlineLevel should add 1
                    var childLevel = (child.props.mode || props.root.props.mode) === 'popup' ? 1 : inlineLevel + 1;

                    switch (child.type.menuChildType) {
                        case 'submenu':
                            newChild = cloneElement(child, props, loop(child.props.children, pos, undefined, childLevel));
                            break;
                        case 'group':
                            newChild = cloneElement(child, props, loop(child.props.children, posPrefix, indexWrapper, props.level));
                            break;
                        case 'item':
                        case 'divider':
                            newChild = cloneElement(child, props);
                            break;
                        default:
                            newChild = child;
                            break;
                    }

                    return newChild;
                }

                return child;
            });
        };

        return loop(arr, '0');
    };

    Menu.prototype.normalizeToArray = function normalizeToArray(items) {
        if (items) {
            if (Array.isArray(items)) {
                return items;
            }
            return [items];
        }

        return [];
    };

    Menu.prototype.isSibling = function isSibling(currentPos, targetPos) {
        var currentNums = currentPos.split('-').slice(0, -1);
        var targetNums = targetPos.split('-').slice(0, -1);

        return currentNums.length === targetNums.length && currentNums.every(function (num, index) {
            return num === targetNums[index];
        });
    };

    Menu.prototype.isAncestor = function isAncestor(currentPos, targetPos) {
        var currentNums = currentPos.split('-');
        var targetNums = targetPos.split('-');

        return currentNums.length > targetNums.length && targetNums.every(function (num, index) {
            return num === currentNums[index];
        });
    };

    Menu.prototype.handleOpen = function handleOpen(key, open, triggerType, e) {
        var _this4 = this;

        var newOpenKeys = void 0;

        var _props3 = this.props,
            mode = _props3.mode,
            openMode = _props3.openMode;
        var openKeys = this.state.openKeys;

        var index = openKeys.indexOf(key);
        if (open && index === -1) {
            if (mode === 'inline') {
                if (openMode === 'single') {
                    newOpenKeys = openKeys.filter(function (k) {
                        return _this4.k2n[k] && !_this4.isSibling(_this4.k2n[key].pos, _this4.k2n[k].pos);
                    });
                    newOpenKeys.push(key);
                } else {
                    newOpenKeys = openKeys.concat(key);
                }
            } else {
                newOpenKeys = openKeys.filter(function (k) {
                    return _this4.k2n[k] && _this4.isAncestor(_this4.k2n[key].pos, _this4.k2n[k].pos);
                });
                newOpenKeys.push(key);
            }
        } else if (!open && index > -1) {
            if (mode === 'inline') {
                newOpenKeys = [].concat(openKeys.slice(0, index), openKeys.slice(index + 1));
            } else if (triggerType === 'docClick') {
                if (!this.popupNodes.concat(this.menuNode).some(function (node) {
                    return node.contains(e.target);
                })) {
                    newOpenKeys = [];
                }
            } else {
                newOpenKeys = openKeys.filter(function (k) {
                    return k !== key && _this4.k2n[k] && !_this4.isAncestor(_this4.k2n[k].pos, _this4.k2n[key].pos);
                });
            }
        }

        if (newOpenKeys) {
            if (isNil(this.props.openKeys)) {
                this.setState({
                    openKeys: newOpenKeys
                });
            }

            this.props.onOpen(newOpenKeys, {
                key: key,
                open: open
            });
        }
    };

    Menu.prototype.getPath = function getPath(key) {
        var keyPath = [];
        var labelPath = [];

        var pos = this.k2n[key].pos;
        var nums = pos.split('-');
        for (var i = 1; i < nums.length - 1; i++) {
            var parentNums = nums.slice(0, i + 1);
            var parentPos = parentNums.join('-');
            var parent = this.p2n[parentPos];
            keyPath.push(parent.key);
            labelPath.push(parent.label);
        }

        return {
            keyPath: keyPath,
            labelPath: labelPath
        };
    };

    Menu.prototype.handleSelect = function handleSelect(key, select, menuItem) {
        var pos = this.k2n[key].pos;
        var level = pos.split('-').length - 1;
        if (this.props.shallowSelect && level > 1) {
            return;
        }

        var newSelectedKeys = void 0;

        var selectMode = this.props.selectMode;
        var selectedKeys = this.state.selectedKeys;

        var index = selectedKeys.indexOf(key);
        if (select && index === -1) {
            if (selectMode === 'single') {
                newSelectedKeys = [key];
            } else if (selectMode === 'multiple') {
                newSelectedKeys = selectedKeys.concat(key);
            }
        } else if (!select && index > -1 && selectMode === 'multiple') {
            newSelectedKeys = [].concat(selectedKeys.slice(0, index), selectedKeys.slice(index + 1));
        }

        if (newSelectedKeys) {
            if (isNil(this.props.selectedKeys)) {
                this.setState({
                    selectedKeys: newSelectedKeys
                });
            }

            this.props.onSelect(newSelectedKeys, menuItem, _extends({
                key: key,
                select: select,
                label: this.k2n[key].label
            }, this.getPath(key)));
        }
    };

    Menu.prototype.handleItemClick = function handleItemClick(key, item, e) {
        var _this5 = this;

        if (this.props.focusable) {
            if (isNil(this.props.focusedKey)) {
                this.setState({
                    focusedKey: key
                });
            }

            this.props.onItemFocus(key, item, e);
        }

        if (item.props.type === 'item') {
            if (item.props.parentMode === 'popup' && this.state.openKeys.length) {
                if (isNil(this.props.openKeys)) {
                    this.setState({
                        openKeys: []
                    });
                }

                this.props.onOpen([], {
                    key: this.state.openKeys.sort(function (prevKey, nextKey) {
                        return _this5.k2n[nextKey].pos.split('-').length - _this5.k2n[prevKey].pos.split('-').length;
                    })[0],
                    open: false
                });
            }

            this.props.onItemClick(key, item, e);
        }
    };

    Menu.prototype.isAvailablePos = function isAvailablePos(refPos, targetPos) {
        var _p2n$targetPos = this.p2n[targetPos],
            type = _p2n$targetPos.type,
            disabled = _p2n$targetPos.disabled;


        return this.isSibling(refPos, targetPos) && (type === 'item' && !disabled || type === 'submenu');
    };

    Menu.prototype.getAvailableKey = function getAvailableKey(pos, prev) {
        var _this6 = this;

        var ps = Object.keys(this.p2n).filter(function (p) {
            return _this6.isAvailablePos(pos, p);
        });
        if (ps.length > 1) {
            var index = ps.indexOf(pos);
            var targetIndex = void 0;
            if (prev) {
                targetIndex = index === 0 ? ps.length - 1 : index - 1;
            } else {
                targetIndex = index === ps.length - 1 ? 0 : index + 1;
            }

            return this.p2n[ps[targetIndex]].key;
        }

        return null;
    };

    Menu.prototype.getFirstAvaliablelChildKey = function getFirstAvaliablelChildKey(parentPos) {
        var _this7 = this;

        var pos = Object.keys(this.p2n).find(function (p) {
            return _this7.isAvailablePos(parentPos + '-0', p);
        });
        return pos ? this.p2n[pos].key : null;
    };

    Menu.prototype.getParentKey = function getParentKey(pos) {
        return this.p2n[pos.slice(0, pos.length - 2)].key;
    };

    Menu.prototype.handleItemKeyDown = function handleItemKeyDown(key, type, item, e) {
        if ([KEYCODE.UP, KEYCODE.DOWN, KEYCODE.RIGHT, KEYCODE.LEFT, KEYCODE.ENTER, KEYCODE.ESC, KEYCODE.SPACE].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            e.stopPropagation();
        }

        var focusedKey = this.state.focusedKey;

        var direction = this.props.direction;

        var pos = this.k2n[key].pos;
        var level = pos.split('-').length - 1;
        switch (e.keyCode) {
            case KEYCODE.UP:
                {
                    var avaliableKey = this.getAvailableKey(pos, true);
                    if (avaliableKey) {
                        focusedKey = avaliableKey;
                    }
                    break;
                }
            case KEYCODE.DOWN:
                {
                    var _avaliableKey = void 0;
                    if (direction === 'hoz' && level === 1 && type === 'submenu') {
                        this.handleOpen(key, true);
                        _avaliableKey = this.getFirstAvaliablelChildKey(pos);
                    } else {
                        _avaliableKey = this.getAvailableKey(pos, false);
                    }
                    if (_avaliableKey) {
                        focusedKey = _avaliableKey;
                    }
                    break;
                }
            case KEYCODE.RIGHT:
                {
                    var _avaliableKey2 = void 0;
                    if (direction === 'hoz' && level === 1) {
                        _avaliableKey2 = this.getAvailableKey(pos, false);
                    } else if (type === 'submenu') {
                        this.handleOpen(key, true);
                        _avaliableKey2 = this.getFirstAvaliablelChildKey(pos);
                    }
                    if (_avaliableKey2) {
                        focusedKey = _avaliableKey2;
                    }
                    break;
                }
            case KEYCODE.ENTER:
                {
                    if (type === 'submenu') {
                        this.handleOpen(key, true);
                        var _avaliableKey3 = this.getFirstAvaliablelChildKey(pos);
                        if (_avaliableKey3) {
                            focusedKey = _avaliableKey3;
                        }
                    }
                    break;
                }
            case KEYCODE.LEFT:
                {
                    if (direction === 'hoz' && level === 1) {
                        var _avaliableKey4 = this.getAvailableKey(pos, true);
                        if (_avaliableKey4) {
                            focusedKey = _avaliableKey4;
                        }
                    } else if (level > 1) {
                        var parentKey = this.getParentKey(pos);
                        this.handleOpen(parentKey, false);
                        focusedKey = parentKey;
                    }
                    break;
                }
            case KEYCODE.ESC:
                if (level > 1) {
                    var _parentKey = this.getParentKey(pos);
                    this.handleOpen(_parentKey, false);
                    focusedKey = _parentKey;
                }
                break;

            case KEYCODE.TAB:
                focusedKey = null;
                break;
            default:
                break;
        }

        if (focusedKey !== this.state.focusedKey) {
            if (isNil(this.props.focusedKey)) {
                this.setState({
                    focusedKey: focusedKey
                });
            }

            this.props.onItemKeyDown(focusedKey, item, e);
            this.props.onItemFocus(focusedKey, e);
        }
    };

    Menu.prototype.render = function render() {
        var _cx2;

        var _props4 = this.props,
            prefix = _props4.prefix,
            className = _props4.className,
            direction = _props4.direction,
            hozAlign = _props4.hozAlign,
            header = _props4.header,
            footer = _props4.footer,
            embeddable = _props4.embeddable,
            selectMode = _props4.selectMode,
            hozInLine = _props4.hozInLine,
            rtl = _props4.rtl;

        var others = pickOthers(Object.keys(Menu.propTypes), this.props);

        var newClassName = cx((_cx2 = {}, _cx2[prefix + 'menu'] = true, _cx2[prefix + 'ver'] = direction === 'ver', _cx2[prefix + 'hoz'] = direction === 'hoz', _cx2[prefix + 'menu-embeddable'] = embeddable, _cx2[prefix + 'menu-nowrap'] = hozInLine, _cx2[className] = !!className, _cx2));

        var role = direction === 'hoz' ? 'menubar' : 'menu';
        var ariaMultiselectable = void 0;
        if ('selectMode' in this.props) {
            role = 'listbox';
            ariaMultiselectable = !!(selectMode === 'multiple');
        }

        var headerElement = header ? React.createElement(
            'li',
            { className: prefix + 'menu-header', ref: this.menuHeaderRef },
            header
        ) : null;
        var itemsElement = header || footer ? React.createElement(
            'ul',
            {
                className: prefix + 'menu-content',
                ref: this.menuContentRef
            },
            this.newChildren
        ) : this.newChildren;
        var footerElement = footer ? React.createElement(
            'li',
            { className: prefix + 'menu-footer', ref: this.menuFooterRef },
            footer
        ) : null;
        var shouldWrapItemsAndFooter = hozAlign === 'right' && !!header;

        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            'ul',
            _extends({
                role: role,
                onBlur: this.onBlur,
                className: newClassName,
                onKeyDown: this.handleEnter,
                'aria-multiselectable': ariaMultiselectable
            }, others),
            headerElement,
            shouldWrapItemsAndFooter ? React.createElement(
                'div',
                { className: prefix + 'menu-hoz-right' },
                itemsElement,
                footerElement
            ) : null,
            !shouldWrapItemsAndFooter ? itemsElement : null,
            !shouldWrapItemsAndFooter ? footerElement : null
        );
    };

    return Menu;
}(Component), _class.isNextMenu = true, _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 菜单项和子菜单
     */
    children: PropTypes.node,
    /**
     * 点击菜单项触发的回调函数
     * @param {String} key 点击的菜单项的 key 值
     * @param {Object} item 点击的菜单项对象
     * @param {Object} event 点击的事件对象
     */
    onItemClick: PropTypes.func,
    /**
     * 当前打开的子菜单的 key 值
     */
    openKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 初始打开的子菜单的 key 值
     */
    defaultOpenKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 初始展开所有的子菜单，只在 mode 设置为 'inline' 以及 openMode 设置为 'multiple' 下生效，优先级高于 defaultOpenKeys
     */
    defaultOpenAll: PropTypes.bool,
    /**
     * 打开或关闭子菜单触发的回调函数
     * @param {String} key 打开的所有子菜单的 key 值
     * @param {Object} extra 额外参数
     * @param {String} extra.key 当前操作子菜单的 key 值
     * @param {Boolean} extra.open 是否是打开
     */
    onOpen: PropTypes.func,
    /**
     * 子菜单打开的模式
     */
    mode: PropTypes.oneOf(['inline', 'popup']),
    /**
     * 子菜单打开的触发行为
     */
    triggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * 展开内连子菜单的模式，同时可以展开一个子菜单还是多个子菜单，该属性仅在 mode 为 inline 时生效
     */
    openMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 内连子菜单缩进距离
     */
    inlineIndent: PropTypes.number,
    inlineArrowDirection: PropTypes.oneOf(['down', 'right']),
    /**
     * 是否自动让弹层的宽度和菜单项保持一致，如果弹层的宽度比菜单项小则和菜单项保持一致，如果宽度大于菜单项则不做处理
     */
    popupAutoWidth: PropTypes.bool,
    /**
     * 弹层的对齐方式
     */
    popupAlign: PropTypes.oneOf(['follow', 'outside']),
    /**
     * 弹层自定义 props
     */
    popupProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * 弹出子菜单自定义 className
     */
    popupClassName: PropTypes.string,
    /**
     * 弹出子菜单自定义 style
     */
    popupStyle: PropTypes.object,
    /**
     * 当前选中菜单项的 key 值
     */
    selectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 初始选中菜单项的 key 值
     */
    defaultSelectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    /**
     * 选中或取消选中菜单项触发的回调函数
     * @param {Array} selectedKeys 选中的所有菜单项的值
     * @param {Object} item 选中或取消选中的菜单项
     * @param {Object} extra 额外参数
     * @param {Boolean} extra.select 是否是选中
     * @param {Array} extra.key 菜单项的 key
     * @param {Object} extra.label 菜单项的文本
     * @param {Array} extra.keyPath 菜单项 key 的路径
     */
    onSelect: PropTypes.func,
    /**
     * 选中模式，单选还是多选，默认无值，不可选
     */
    selectMode: PropTypes.oneOf(['single', 'multiple']),
    /**
     * 是否只能选择第一层菜单项（不能选择子菜单中的菜单项）
     */
    shallowSelect: PropTypes.bool,
    /**
     * 是否显示选中图标，如果设置为 false 需配合配置平台设置选中时的背景色以示区分
     */
    hasSelectedIcon: PropTypes.bool,
    labelToggleChecked: PropTypes.bool,
    /**
     * 是否将选中图标居右，仅当 hasSelectedIcon 为true 时生效。
     * 注意：SubMenu 上的选中图标一直居左，不受此API控制
     */
    isSelectIconRight: PropTypes.bool,
    /**
     * 菜单第一层展示方向
     */
    direction: PropTypes.oneOf(['ver', 'hoz']),
    /**
     * 横向菜单条 item 和 footer 的对齐方向，在 direction 设置为 'hoz' 并且 header 存在时生效
     */
    hozAlign: PropTypes.oneOf(['left', 'right']),
    /**
     * 横向菜单模式下，是否维持在一行，即超出一行折叠成 SubMenu 显示， 仅在 direction='hoz' mode='popup' 时生效
     */
    hozInLine: PropTypes.bool,
    renderMore: PropTypes.func,
    /**
     * 自定义菜单头部
     */
    header: PropTypes.node,
    /**
     * 自定义菜单尾部
     */
    footer: PropTypes.node,
    /**
     * 是否自动获得焦点
     */
    autoFocus: PropTypes.bool,
    /**
     * 当前获得焦点的子菜单或菜单项 key 值
     */
    focusedKey: PropTypes.string,
    focusable: PropTypes.bool,
    onItemFocus: PropTypes.func,
    onBlur: PropTypes.func,
    /**
     * 是否开启嵌入式模式，一般用于Layout的布局中，开启后没有默认背景、外层border、box-shadow，可以配合`<Menu style={{lineHeight: '100px'}}>` 自定义高度
     */
    embeddable: PropTypes.bool,
    onItemKeyDown: PropTypes.func,
    expandAnimation: PropTypes.bool,
    itemClassName: PropTypes.string
}), _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    defaultOpenKeys: [],
    defaultOpenAll: false,
    onOpen: noop,
    mode: 'inline',
    triggerType: 'click',
    openMode: 'multiple',
    inlineIndent: 20,
    inlineArrowDirection: 'down',
    popupAutoWidth: false,
    popupAlign: 'follow',
    popupProps: {},
    defaultSelectedKeys: [],
    onSelect: noop,
    shallowSelect: false,
    hasSelectedIcon: true,
    isSelectIconRight: false,
    labelToggleChecked: true,
    direction: 'ver',
    hozAlign: 'left',
    hozInLine: false,
    autoFocus: false,
    focusable: true,
    embeddable: false,
    onItemFocus: noop,
    onItemKeyDown: noop,
    onItemClick: noop,
    expandAnimation: true
}, _initialiseProps = function _initialiseProps() {
    var _this8 = this;

    this.addIndicators = function (children) {
        var arr = [];
        var lastVisibleIndex = _this8.state.lastVisibleIndex;


        children.forEach(function (child, index) {
            var overflowedItems = [];

            if (index > lastVisibleIndex) {
                child = React.cloneElement(child, {
                    key: 'more-' + index,
                    style: { display: 'none' },
                    className: (child.className || '') + ' ' + MENUITEM_OVERFLOWED_CLASSNAME
                });
            }

            if (index === lastVisibleIndex + 1) {
                overflowedItems = children.slice(lastVisibleIndex + 1).map(function (c, i) {
                    return React.cloneElement(c, {
                        key: 'more-' + index + '-' + i
                    });
                });
                arr.push(_this8.getIndicatorsItem(overflowedItems));
            }

            arr.push(child);
        });

        arr.push(_this8.getIndicatorsItem([], true));

        return arr;
    };

    this.menuContentRef = function (ref) {
        _this8.menuContent = ref;
    };

    this.menuHeaderRef = function (ref) {
        _this8.menuHeader = ref;
    };

    this.menuFooterRef = function (ref) {
        _this8.menuFooter = ref;
    };
}, _temp);
Menu.displayName = 'Menu';
export { Menu as default };