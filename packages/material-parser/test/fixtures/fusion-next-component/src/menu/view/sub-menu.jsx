import React, { Component, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Animate from '../../animate';
import Icon from '../../icon';
import { func, obj } from '../../util';
import Item from './item';
import SelectabelItem from './selectable-item';
import PopupItem from './popup-item';

const { Expand } = Animate;
const { bindCtx } = func;

/**
 * Menu.SubMenu
 * @order 1
 */
export default class SubMenu extends Component {
    static menuChildType = 'submenu';

    static propTypes = {
        _key: PropTypes.string,
        root: PropTypes.object,
        level: PropTypes.number,
        inlineLevel: PropTypes.number,
        groupIndent: PropTypes.number,
        noIcon: PropTypes.bool,
        /**
         * 标签内容
         */
        label: PropTypes.node,
        /**
         * 是否可选，该属性仅在设置 Menu 组件 selectMode 属性后生效
         */
        selectable: PropTypes.bool,
        /**
         * 子菜单打开方式，如果设置会覆盖 Menu 上的同名属性
         * @default Menu 的 mode 属性值
         */
        mode: PropTypes.oneOf(['inline', 'popup']),
        /**
         * 菜单项或下一级子菜单
         */
        children: PropTypes.node,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        subMenuContentClassName: PropTypes.string,
        triggerType: PropTypes.oneOf(['click', 'hover']),
        align: PropTypes.oneOf(['outside', 'follow']),
        parentMode: PropTypes.oneOf(['inline', 'popup']),
    };

    static defaultProps = {
        groupIndent: 0,
        noIcon: false,
        selectable: false,
    };

    constructor(props) {
        super(props);

        bindCtx(this, [
            'handleMouseEnter',
            'handleMouseLeave',
            'handleClick',
            'handleOpen',
            'afterLeave',
        ]);
    }

    componentDidMount() {
        this.itemNode = findDOMNode(this);
    }

    afterLeave() {
        const { focused, root } = this.props;
        const { focusable } = root.props;
        if (focusable && focused) {
            this.itemNode.focus();
        }
    }

    getOpen() {
        const { _key, root } = this.props;
        const { openKeys } = root.state;

        return openKeys.indexOf(_key) > -1;
    }

    getChildSelected() {
        const { _key, root } = this.props;
        const { selectMode } = root.props;
        const { selectedKeys } = root.state;

        const _keyPos = root.k2n[_key].pos;

        return (
            !!selectMode &&
            selectedKeys.some(
                key => root.k2n[key] && root.k2n[key].pos.indexOf(_keyPos) === 0
            )
        );
    }

    handleMouseEnter(e) {
        this.handleOpen(true);

        this.props.onMouseEnter && this.props.onMouseEnter(e);
    }

    handleMouseLeave(e) {
        this.handleOpen(false);

        this.props.onMouseLeave && this.props.onMouseLeave(e);
    }

    handleClick(e) {
        const { root, selectable } = this.props;
        const { selectMode } = root.props;
        if (selectMode && selectable) {
            e.stopPropagation();
        }

        const open = this.getOpen();
        this.handleOpen(!open);
    }

    handleOpen(open, triggerType, e) {
        const { _key, root } = this.props;
        root.handleOpen(_key, open, triggerType, e);
    }

    passParentToChildren(children) {
        const { mode, root } = this.props;

        return Children.map(children, child => {
            // to fix https://github.com/alibaba-fusion/next/issues/952
            if (typeof child !== 'function' && typeof child !== 'object') {
                return child;
            }

            return cloneElement(child, {
                parent: this,
                parentMode: mode || root.props.mode,
            });
        });
    }

    renderInline() {
        const {
            _key,
            level,
            inlineLevel,
            root,
            className,
            selectable: selectableFromProps,
            label,
            children,
            noIcon,
            subMenuContentClassName,
            triggerType: propsTriggerType,
            parentMode,
        } = this.props;
        const {
            prefix,
            selectMode,
            triggerType: rootTriggerType,
            inlineArrowDirection,
            expandAnimation,
            rtl,
        } = root.props;
        const triggerType = propsTriggerType || rootTriggerType;
        const open = this.getOpen();
        const isChildSelected = this.getChildSelected();

        const others = obj.pickOthers(
            Object.keys(SubMenu.propTypes),
            this.props
        );

        const liProps = {
            className: cx({
                [`${prefix}menu-sub-menu-wrapper`]: true,
                [className]: !!className,
            }),
        };
        const itemProps = {
            'aria-expanded': open,
            _key,
            level,
            role: 'listitem',
            inlineLevel,
            root,
            type: 'submenu',
            component: 'div',
            parentMode,
            className: cx({
                [`${prefix}opened`]: open,
                [`${prefix}child-selected`]: isChildSelected,
            }),
        };
        const arrorProps = {
            type:
                inlineArrowDirection === 'right' ? 'arrow-right' : 'arrow-down',
            className: cx({
                [`${prefix}menu-icon-arrow`]: true,
                [`${prefix}menu-icon-arrow-down`]:
                    inlineArrowDirection === 'down',
                [`${prefix}menu-icon-arrow-right`]:
                    inlineArrowDirection === 'right',
                [`${prefix}open`]: open,
            }),
        };

        const selectable = !!selectMode && selectableFromProps;
        const NewItem = selectable ? SelectabelItem : Item;

        if (triggerType === 'hover') {
            liProps.onMouseEnter = this.handleMouseEnter;
            liProps.onMouseLeave = this.handleMouseLeave;
        } else if (selectable) {
            arrorProps.onClick = this.handleClick;
        } else {
            itemProps.onClick = this.handleClick;
        }

        const newSubMenuContentClassName = cx({
            [`${prefix}menu-sub-menu`]: true,
            [subMenuContentClassName]: !!subMenuContentClassName,
        });

        let roleMenu = 'menu',
            roleItem = 'menuitem';
        if ('selectMode' in root.props) {
            roleMenu = 'listbox';
            roleItem = 'option';
        }

        const subMenu = open ? (
            <ul
                role={roleMenu}
                dir={rtl ? 'rtl' : undefined}
                ref="subMenu"
                className={newSubMenuContentClassName}
            >
                {this.passParentToChildren(children)}
            </ul>
        ) : null;

        return (
            <li role={roleItem} {...others} {...liProps}>
                <NewItem {...itemProps}>
                    <span className={`${prefix}menu-item-text`}>{label}</span>
                    {noIcon ? null : <Icon {...arrorProps} />}
                </NewItem>
                {expandAnimation ? (
                    <Expand
                        animationAppear={false}
                        afterLeave={this.afterLeave}
                    >
                        {subMenu}
                    </Expand>
                ) : (
                    subMenu
                )}
            </li>
        );
    }

    renderPopup() {
        const {
            children,
            subMenuContentClassName,
            noIcon,
            ...others
        } = this.props;
        const root = this.props.root;
        const { prefix, popupClassName, popupStyle, rtl } = root.props;

        const newClassName = cx({
            [`${prefix}menu`]: true,
            [`${prefix}ver`]: true,
            [popupClassName]: !!popupClassName,
            [subMenuContentClassName]: !!subMenuContentClassName,
        });

        others.rtl = rtl;

        return (
            <PopupItem {...others} noIcon={noIcon} hasSubMenu>
                <ul
                    role="menu"
                    dir={rtl ? 'rtl' : undefined}
                    className={newClassName}
                    style={popupStyle}
                >
                    {this.passParentToChildren(children)}
                </ul>
            </PopupItem>
        );
    }

    render() {
        const { mode, root } = this.props;
        const newMode = mode || root.props.mode;

        return newMode === 'popup' ? this.renderPopup() : this.renderInline();
    }
}
