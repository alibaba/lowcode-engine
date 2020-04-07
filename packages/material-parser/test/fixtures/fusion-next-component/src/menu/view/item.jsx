import React, { Component, Children, isValidElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { func, obj, KEYCODE } from '../../util';

const { bindCtx } = func;
const { pickOthers } = obj;

export default class Item extends Component {
    static propTypes = {
        _key: PropTypes.string,
        level: PropTypes.number,
        inlineLevel: PropTypes.number,
        groupIndent: PropTypes.number,
        root: PropTypes.object,
        menu: PropTypes.any,
        parent: PropTypes.object,
        parentMode: PropTypes.oneOf(['inline', 'popup']),
        type: PropTypes.oneOf(['submenu', 'item']),
        component: PropTypes.string,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        onClick: PropTypes.func,
        onKeyDown: PropTypes.func,
        needIndent: PropTypes.bool,
        replaceClassName: PropTypes.bool,
    };

    static defaultProps = {
        component: 'li',
        groupIndent: 0,
        replaceClassName: false,
        needIndent: true,
    };

    constructor(props) {
        super(props);

        bindCtx(this, ['handleClick', 'handleKeyDown']);
    }

    componentDidMount() {
        this.itemNode = findDOMNode(this);

        const { parentMode, root, menu } = this.props;
        if (menu) {
            this.menuNode = findDOMNode(menu);
        } else if (parentMode === 'popup') {
            this.menuNode = this.itemNode.parentNode;
        } else {
            this.menuNode = findDOMNode(root);
            const { prefix, header, footer } = root.props;
            if (header || footer) {
                this.menuNode = this.menuNode.querySelector(
                    `.${prefix}menu-content`
                );
            }
        }

        this.setFocus();
    }

    componentDidUpdate() {
        this.setFocus();
    }

    focusable() {
        const { root, type, disabled } = this.props;
        const { focusable } = root.props;
        return focusable && (type === 'submenu' || !disabled);
    }

    getFocused() {
        const { _key, root } = this.props;
        const { focusedKey } = root.state;
        return focusedKey === _key;
    }

    setFocus() {
        const focused = this.getFocused();
        if (focused) {
            if (this.focusable()) {
                this.itemNode.focus({ preventScroll: true });
            }
            if (
                this.menuNode &&
                this.menuNode.scrollHeight > this.menuNode.clientHeight
            ) {
                const scrollBottom =
                    this.menuNode.clientHeight + this.menuNode.scrollTop;
                const itemBottom =
                    this.itemNode.offsetTop + this.itemNode.offsetHeight;
                if (itemBottom > scrollBottom) {
                    this.menuNode.scrollTop =
                        itemBottom - this.menuNode.clientHeight;
                } else if (this.itemNode.offsetTop < this.menuNode.scrollTop) {
                    this.menuNode.scrollTop = this.itemNode.offsetTop;
                }
            }
        }
    }

    handleClick(e) {
        e.stopPropagation();

        const { _key, root, disabled } = this.props;

        if (!disabled) {
            root.handleItemClick(_key, this, e);

            this.props.onClick && this.props.onClick(e);
        } else {
            e.preventDefault();
        }
    }

    handleKeyDown(e) {
        const { _key, root, type } = this.props;

        if (this.focusable()) {
            root.handleItemKeyDown(_key, type, this, e);

            switch (e.keyCode) {
                case KEYCODE.ENTER: {
                    if (!(type === 'submenu')) {
                        this.handleClick(e);
                    }
                    break;
                }
            }
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    getTitle(children) {
        let labelString = '';

        const loop = children => {
            Children.forEach(children, child => {
                if (isValidElement(child) && child.props.children) {
                    loop(child.props.children);
                } else if (typeof child === 'string') {
                    labelString += child;
                }
            });
        };

        loop(children);

        return labelString;
    }

    render() {
        const {
            inlineLevel,
            root,
            replaceClassName,
            groupIndent,
            component,
            disabled,
            className,
            children,
            needIndent,
            parentMode,
            _key,
        } = this.props;
        const others = pickOthers(Object.keys(Item.propTypes), this.props);

        const {
            prefix,
            focusable,
            inlineIndent,
            itemClassName,
            rtl,
        } = root.props;
        const focused = this.getFocused();

        const newClassName = replaceClassName
            ? className
            : cx({
                  [`${prefix}menu-item`]: true,
                  [`${prefix}disabled`]: disabled,
                  [`${prefix}focused`]: !focusable && focused,
                  [itemClassName]: !!itemClassName,
                  [className]: !!className,
              });
        if (disabled) {
            others['aria-disabled'] = true;
            others['aria-hidden'] = true;
        }

        others.tabIndex = root.tabbableKey === _key ? '0' : '-1';

        if (
            parentMode === 'inline' &&
            inlineLevel > 1 &&
            inlineIndent > 0 &&
            needIndent
        ) {
            const paddingProp = rtl ? 'paddingRight' : 'paddingLeft';
            others.style = {
                ...(others.style || {}),
                [paddingProp]: `${inlineLevel * inlineIndent -
                    (groupIndent || 0) * 0.4 * inlineIndent}px`,
            };
        }
        const TagName = component;

        let role = 'menuitem';
        if ('selectMode' in root.props) {
            role = 'option';
        }

        return (
            <TagName
                role={role}
                title={this.getTitle(children)}
                {...others}
                className={newClassName}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            >
                <div className={`${prefix}menu-item-inner`}>{children}</div>
            </TagName>
        );
    }
}
