import React, { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import SubMenu from './sub-menu';
import ConfigProvider from '../../config-provider';
import { func, obj, dom, events, KEYCODE } from '../../util';
import { getWidth } from './util';

const { bindCtx } = func;
const { pickOthers, isNil } = obj;
const noop = () => {};
const MENUITEM_OVERFLOWED_CLASSNAME = 'menuitem-overflowed';

/**
 * Menu
 */
export default class Menu extends Component {
    static isNextMenu = true;

    static propTypes = {
        ...ConfigProvider.propTypes,
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
        defaultOpenKeys: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
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
        defaultSelectedKeys: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
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
        itemClassName: PropTypes.string,
    };

    static defaultProps = {
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
        expandAnimation: true,
    };

    constructor(props) {
        super(props);

        const {
            children,
            selectedKeys,
            defaultSelectedKeys,
            focusedKey,
            focusable,
            autoFocus,
            hozInLine,
        } = this.props;

        this.state = {
            lastVisibleIndex: undefined,
        };

        this.newChildren = this.getNewChildren({ children, hozInLine });

        if (focusable) {
            this.tabbableKey = this.getFirstAvaliablelChildKey('0');
        }

        this.state = {
            lastVisibleIndex: undefined,
            openKeys: this.getInitOpenKeys(props),
            selectedKeys: this.normalizeToArray(
                selectedKeys || defaultSelectedKeys
            ),
            focusedKey: !isNil(this.props.focusedKey)
                ? focusedKey
                : focusable && autoFocus
                ? this.tabbableKey
                : null,
        };

        bindCtx(this, [
            'handleOpen',
            'handleSelect',
            'handleItemClick',
            'handleItemKeyDown',
            'onBlur',
            'adjustChildrenWidth',
        ]);

        this.popupNodes = [];
    }

    componentDidMount() {
        this.menuNode = findDOMNode(this);

        this.adjustChildrenWidth();

        if (this.props.hozInLine) {
            events.on(window, 'resize', this.adjustChildrenWidth);
        }
    }

    componentWillReceiveProps(nextProps) {
        const state = {};

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
    }

    componentWillUpdate(nextProps, nextState) {
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
    }

    componentWillUnmount() {
        events.off(window, 'resize', this.adjustChildrenWidth);
    }

    adjustChildrenWidth() {
        const { direction, prefix, header, footer, hozInLine } = this.props;
        if (direction !== 'hoz' || !hozInLine) {
            return;
        }

        if (!this.menuNode && !this.menuContent) {
            return;
        }

        let children = [],
            spaceWidth;

        if (header || footer) {
            children = this.menuContent.children;
            spaceWidth =
                getWidth(this.menuNode) -
                getWidth(this.menuHeader) -
                getWidth(this.menuFooter);
        } else {
            children = this.menuNode.children;
            spaceWidth = getWidth(this.menuNode);
        }

        if (children.length < 2) {
            return;
        }

        let currentSumWidth = 0,
            lastVisibleIndex = -1;

        const menuItemNodes = [].slice
            .call(children)
            .filter(
                node =>
                    node.className.split(' ').indexOf(`${prefix}menu-more`) < 0
            );

        const overflowedItems = menuItemNodes.filter(
            c =>
                c.className.split(' ').indexOf(MENUITEM_OVERFLOWED_CLASSNAME) >=
                0
        );

        overflowedItems.forEach(c => {
            dom.setStyle(c, 'display', 'inline-block');
        });

        const lastIndicator = children[children.length - 1];
        dom.setStyle(lastIndicator, 'display', 'inline-block');
        const moreWidth = getWidth(lastIndicator);
        dom.setStyle(lastIndicator, 'display', 'none');

        this.menuItemSizes = menuItemNodes.map(c => getWidth(c));

        overflowedItems.forEach(c => {
            dom.setStyle(c, 'display', 'none');
        });

        this.menuItemSizes.forEach(liWidth => {
            currentSumWidth += liWidth;
            if (currentSumWidth + moreWidth <= spaceWidth) {
                lastVisibleIndex++;
            }
        });

        this.setState({
            lastVisibleIndex,
        });
    }
    onBlur(e) {
        this.setState({
            focusedKey: undefined,
        });

        this.props.onBlur && this.props.onBlur(e);
    }

    getInitOpenKeys(props) {
        let initOpenKeys;

        const {
            openKeys,
            defaultOpenKeys,
            defaultOpenAll,
            mode,
            openMode,
        } = props;
        if (openKeys) {
            initOpenKeys = openKeys;
        } else if (
            defaultOpenAll &&
            mode === 'inline' &&
            openMode === 'multiple'
        ) {
            initOpenKeys = Object.keys(this.k2n).filter(key => {
                return this.k2n[key].type === 'submenu';
            });
        } else {
            initOpenKeys = defaultOpenKeys;
        }

        return this.normalizeToArray(initOpenKeys);
    }

    getIndicatorsItem(items, isPlaceholder) {
        const { prefix, renderMore } = this.props;
        const moreCls = cx({
            [`${prefix}menu-more`]: true,
        });

        const style = {};
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
                style,
            });
        }

        return (
            <SubMenu label="···" noIcon className={moreCls} style={style}>
                {items}
            </SubMenu>
        );
    }

    addIndicators = children => {
        const arr = [];
        const { lastVisibleIndex } = this.state;

        children.forEach((child, index) => {
            let overflowedItems = [];

            if (index > lastVisibleIndex) {
                child = React.cloneElement(child, {
                    key: `more-${index}`,
                    style: { display: 'none' },
                    className: `${child.className ||
                        ''} ${MENUITEM_OVERFLOWED_CLASSNAME}`,
                });
            }

            if (index === lastVisibleIndex + 1) {
                overflowedItems = children
                    .slice(lastVisibleIndex + 1)
                    .map((c, i) => {
                        return React.cloneElement(c, {
                            key: `more-${index}-${i}`,
                        });
                    });
                arr.push(this.getIndicatorsItem(overflowedItems));
            }

            arr.push(child);
        });

        arr.push(this.getIndicatorsItem([], true));

        return arr;
    };

    getNewChildren({ children, hozInLine }) {
        this.k2n = {};
        this.p2n = {};

        let arr = [];

        if (hozInLine) {
            arr = this.addIndicators(children);
        } else {
            arr = children;
        }

        const loop = (
            children,
            posPrefix,
            indexWrapper = { index: 0 },
            inlineLevel = 1
        ) => {
            const keyArray = [];
            return Children.map(children, child => {
                if (
                    child &&
                    (typeof child.type === 'function' ||
                        // `React.forwardRef(render)` returns a forwarding
                        // object that includes `render` method, and the specific
                        // `child.type` will be an object instead of a class or
                        // function.
                        typeof child.type === 'object') &&
                    'menuChildType' in child.type
                ) {
                    let newChild;

                    let pos;
                    const props = { root: this };

                    if (
                        ['item', 'submenu', 'group'].indexOf(
                            child.type.menuChildType
                        ) > -1
                    ) {
                        pos = `${posPrefix}-${indexWrapper.index++}`;
                        const key =
                            typeof child.key === 'string' ? child.key : pos;

                        // filter out duplicate keys
                        if (keyArray.indexOf(key) > -1) {
                            return;
                        }

                        keyArray.push(key);

                        const level = pos.split('-').length - 1;
                        this.k2n[key] = this.p2n[pos] = {
                            key,
                            pos,
                            mode: child.props.mode,
                            type: child.type.menuChildType,
                            disabled: child.props.disabled,
                            label: child.props.label || child.props.children,
                        };

                        props.level = level;
                        props.inlineLevel = inlineLevel;
                        props._key = key;
                        props.groupIndent =
                            child.type.menuChildType === 'group' ? 1 : 0;
                    }

                    // paddingLeft(or paddingRight in rtl) only make sense in inline mode
                    // parent know children's inlineLevel
                    // if parent's mode is popup, then children's inlineLevel must be 1;
                    // else inlineLevel should add 1
                    const childLevel =
                        (child.props.mode || props.root.props.mode) === 'popup'
                            ? 1
                            : inlineLevel + 1;

                    switch (child.type.menuChildType) {
                        case 'submenu':
                            newChild = cloneElement(
                                child,
                                props,
                                loop(
                                    child.props.children,
                                    pos,
                                    undefined,
                                    childLevel
                                )
                            );
                            break;
                        case 'group':
                            newChild = cloneElement(
                                child,
                                props,
                                loop(
                                    child.props.children,
                                    posPrefix,
                                    indexWrapper,
                                    props.level
                                )
                            );
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
    }

    normalizeToArray(items) {
        if (items) {
            if (Array.isArray(items)) {
                return items;
            }
            return [items];
        }

        return [];
    }

    isSibling(currentPos, targetPos) {
        const currentNums = currentPos.split('-').slice(0, -1);
        const targetNums = targetPos.split('-').slice(0, -1);

        return (
            currentNums.length === targetNums.length &&
            currentNums.every((num, index) => {
                return num === targetNums[index];
            })
        );
    }

    isAncestor(currentPos, targetPos) {
        const currentNums = currentPos.split('-');
        const targetNums = targetPos.split('-');

        return (
            currentNums.length > targetNums.length &&
            targetNums.every((num, index) => {
                return num === currentNums[index];
            })
        );
    }

    handleOpen(key, open, triggerType, e) {
        let newOpenKeys;

        const { mode, openMode } = this.props;
        const { openKeys } = this.state;
        const index = openKeys.indexOf(key);
        if (open && index === -1) {
            if (mode === 'inline') {
                if (openMode === 'single') {
                    newOpenKeys = openKeys.filter(
                        k =>
                            this.k2n[k] &&
                            !this.isSibling(this.k2n[key].pos, this.k2n[k].pos)
                    );
                    newOpenKeys.push(key);
                } else {
                    newOpenKeys = openKeys.concat(key);
                }
            } else {
                newOpenKeys = openKeys.filter(k => {
                    return (
                        this.k2n[k] &&
                        this.isAncestor(this.k2n[key].pos, this.k2n[k].pos)
                    );
                });
                newOpenKeys.push(key);
            }
        } else if (!open && index > -1) {
            if (mode === 'inline') {
                newOpenKeys = [
                    ...openKeys.slice(0, index),
                    ...openKeys.slice(index + 1),
                ];
            } else if (triggerType === 'docClick') {
                if (
                    !this.popupNodes
                        .concat(this.menuNode)
                        .some(node => node.contains(e.target))
                ) {
                    newOpenKeys = [];
                }
            } else {
                newOpenKeys = openKeys.filter(k => {
                    return (
                        k !== key &&
                        this.k2n[k] &&
                        !this.isAncestor(this.k2n[k].pos, this.k2n[key].pos)
                    );
                });
            }
        }

        if (newOpenKeys) {
            if (isNil(this.props.openKeys)) {
                this.setState({
                    openKeys: newOpenKeys,
                });
            }

            this.props.onOpen(newOpenKeys, {
                key,
                open,
            });
        }
    }

    getPath(key) {
        const keyPath = [];
        const labelPath = [];

        const pos = this.k2n[key].pos;
        const nums = pos.split('-');
        for (let i = 1; i < nums.length - 1; i++) {
            const parentNums = nums.slice(0, i + 1);
            const parentPos = parentNums.join('-');
            const parent = this.p2n[parentPos];
            keyPath.push(parent.key);
            labelPath.push(parent.label);
        }

        return {
            keyPath,
            labelPath,
        };
    }

    handleSelect(key, select, menuItem) {
        const pos = this.k2n[key].pos;
        const level = pos.split('-').length - 1;
        if (this.props.shallowSelect && level > 1) {
            return;
        }

        let newSelectedKeys;

        const { selectMode } = this.props;
        const { selectedKeys } = this.state;
        const index = selectedKeys.indexOf(key);
        if (select && index === -1) {
            if (selectMode === 'single') {
                newSelectedKeys = [key];
            } else if (selectMode === 'multiple') {
                newSelectedKeys = selectedKeys.concat(key);
            }
        } else if (!select && index > -1 && selectMode === 'multiple') {
            newSelectedKeys = [
                ...selectedKeys.slice(0, index),
                ...selectedKeys.slice(index + 1),
            ];
        }

        if (newSelectedKeys) {
            if (isNil(this.props.selectedKeys)) {
                this.setState({
                    selectedKeys: newSelectedKeys,
                });
            }

            this.props.onSelect(newSelectedKeys, menuItem, {
                key,
                select,
                label: this.k2n[key].label,
                ...this.getPath(key),
            });
        }
    }

    handleItemClick(key, item, e) {
        if (this.props.focusable) {
            if (isNil(this.props.focusedKey)) {
                this.setState({
                    focusedKey: key,
                });
            }

            this.props.onItemFocus(key, item, e);
        }

        if (item.props.type === 'item') {
            if (
                item.props.parentMode === 'popup' &&
                this.state.openKeys.length
            ) {
                if (isNil(this.props.openKeys)) {
                    this.setState({
                        openKeys: [],
                    });
                }

                this.props.onOpen([], {
                    key: this.state.openKeys.sort(
                        (prevKey, nextKey) =>
                            this.k2n[nextKey].pos.split('-').length -
                            this.k2n[prevKey].pos.split('-').length
                    )[0],
                    open: false,
                });
            }

            this.props.onItemClick(key, item, e);
        }
    }

    isAvailablePos(refPos, targetPos) {
        const { type, disabled } = this.p2n[targetPos];

        return (
            this.isSibling(refPos, targetPos) &&
            ((type === 'item' && !disabled) || type === 'submenu')
        );
    }

    getAvailableKey(pos, prev) {
        const ps = Object.keys(this.p2n).filter(p =>
            this.isAvailablePos(pos, p)
        );
        if (ps.length > 1) {
            const index = ps.indexOf(pos);
            let targetIndex;
            if (prev) {
                targetIndex = index === 0 ? ps.length - 1 : index - 1;
            } else {
                targetIndex = index === ps.length - 1 ? 0 : index + 1;
            }

            return this.p2n[ps[targetIndex]].key;
        }

        return null;
    }

    getFirstAvaliablelChildKey(parentPos) {
        const pos = Object.keys(this.p2n).find(p =>
            this.isAvailablePos(`${parentPos}-0`, p)
        );
        return pos ? this.p2n[pos].key : null;
    }

    getParentKey(pos) {
        return this.p2n[pos.slice(0, pos.length - 2)].key;
    }

    handleItemKeyDown(key, type, item, e) {
        if (
            [
                KEYCODE.UP,
                KEYCODE.DOWN,
                KEYCODE.RIGHT,
                KEYCODE.LEFT,
                KEYCODE.ENTER,
                KEYCODE.ESC,
                KEYCODE.SPACE,
            ].indexOf(e.keyCode) > -1
        ) {
            e.preventDefault();
            e.stopPropagation();
        }

        let focusedKey = this.state.focusedKey;

        const { direction } = this.props;
        const pos = this.k2n[key].pos;
        const level = pos.split('-').length - 1;
        switch (e.keyCode) {
            case KEYCODE.UP: {
                const avaliableKey = this.getAvailableKey(pos, true);
                if (avaliableKey) {
                    focusedKey = avaliableKey;
                }
                break;
            }
            case KEYCODE.DOWN: {
                let avaliableKey;
                if (direction === 'hoz' && level === 1 && type === 'submenu') {
                    this.handleOpen(key, true);
                    avaliableKey = this.getFirstAvaliablelChildKey(pos);
                } else {
                    avaliableKey = this.getAvailableKey(pos, false);
                }
                if (avaliableKey) {
                    focusedKey = avaliableKey;
                }
                break;
            }
            case KEYCODE.RIGHT: {
                let avaliableKey;
                if (direction === 'hoz' && level === 1) {
                    avaliableKey = this.getAvailableKey(pos, false);
                } else if (type === 'submenu') {
                    this.handleOpen(key, true);
                    avaliableKey = this.getFirstAvaliablelChildKey(pos);
                }
                if (avaliableKey) {
                    focusedKey = avaliableKey;
                }
                break;
            }
            case KEYCODE.ENTER: {
                if (type === 'submenu') {
                    this.handleOpen(key, true);
                    const avaliableKey = this.getFirstAvaliablelChildKey(pos);
                    if (avaliableKey) {
                        focusedKey = avaliableKey;
                    }
                }
                break;
            }
            case KEYCODE.LEFT: {
                if (direction === 'hoz' && level === 1) {
                    const avaliableKey = this.getAvailableKey(pos, true);
                    if (avaliableKey) {
                        focusedKey = avaliableKey;
                    }
                } else if (level > 1) {
                    const parentKey = this.getParentKey(pos);
                    this.handleOpen(parentKey, false);
                    focusedKey = parentKey;
                }
                break;
            }
            case KEYCODE.ESC:
                if (level > 1) {
                    const parentKey = this.getParentKey(pos);
                    this.handleOpen(parentKey, false);
                    focusedKey = parentKey;
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
                    focusedKey,
                });
            }

            this.props.onItemKeyDown(focusedKey, item, e);
            this.props.onItemFocus(focusedKey, e);
        }
    }

    menuContentRef = ref => {
        this.menuContent = ref;
    };

    menuHeaderRef = ref => {
        this.menuHeader = ref;
    };

    menuFooterRef = ref => {
        this.menuFooter = ref;
    };

    render() {
        const {
            prefix,
            className,
            direction,
            hozAlign,
            header,
            footer,
            embeddable,
            selectMode,
            hozInLine,
            rtl,
        } = this.props;
        const others = pickOthers(Object.keys(Menu.propTypes), this.props);

        const newClassName = cx({
            [`${prefix}menu`]: true,
            [`${prefix}ver`]: direction === 'ver',
            [`${prefix}hoz`]: direction === 'hoz',
            [`${prefix}menu-embeddable`]: embeddable,
            [`${prefix}menu-nowrap`]: hozInLine,
            [className]: !!className,
        });

        let role = direction === 'hoz' ? 'menubar' : 'menu';
        let ariaMultiselectable;
        if ('selectMode' in this.props) {
            role = 'listbox';
            ariaMultiselectable = !!(selectMode === 'multiple');
        }

        const headerElement = header ? (
            <li className={`${prefix}menu-header`} ref={this.menuHeaderRef}>
                {header}
            </li>
        ) : null;
        const itemsElement =
            header || footer ? (
                <ul
                    className={`${prefix}menu-content`}
                    ref={this.menuContentRef}
                >
                    {this.newChildren}
                </ul>
            ) : (
                this.newChildren
            );
        const footerElement = footer ? (
            <li className={`${prefix}menu-footer`} ref={this.menuFooterRef}>
                {footer}
            </li>
        ) : null;
        const shouldWrapItemsAndFooter = hozAlign === 'right' && !!header;

        if (rtl) {
            others.dir = 'rtl';
        }

        return (
            <ul
                role={role}
                onBlur={this.onBlur}
                className={newClassName}
                onKeyDown={this.handleEnter}
                aria-multiselectable={ariaMultiselectable}
                {...others}
            >
                {headerElement}
                {shouldWrapItemsAndFooter ? (
                    <div className={`${prefix}menu-hoz-right`}>
                        {itemsElement}
                        {footerElement}
                    </div>
                ) : null}
                {!shouldWrapItemsAndFooter ? itemsElement : null}
                {!shouldWrapItemsAndFooter ? footerElement : null}
            </ul>
        );
    }
}
