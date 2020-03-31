import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Menu from '../menu';
import VirtualList from '../virtual-list';

export default class CascaderMenu extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        className: PropTypes.string,
        useVirtual: PropTypes.bool,
        children: PropTypes.node,
    };

    componentDidMount() {
        this.scrollToSelectedItem();
    }

    scrollToSelectedItem() {
        const { prefix, useVirtual, children } = this.props;
        if (!children || children.length === 0) {
            return;
        }
        const selectedIndex = children.findIndex(
            item =>
                !!item.props.checked ||
                !!item.props.selected ||
                !!item.props.expanded
        );

        if (selectedIndex === -1) {
            return;
        }

        if (useVirtual) {
            const instance = this.refs.virtual.getInstance();
            setTimeout(() => instance.scrollTo(selectedIndex), 0);
        } else {
            const itemSelector = `.${prefix}menu-item`;
            const menu = findDOMNode(this.refs.menu);
            const targetItem = menu.querySelectorAll(itemSelector)[
                selectedIndex
            ];
            if (targetItem) {
                menu.scrollTop =
                    targetItem.offsetTop -
                    Math.floor(
                        (menu.clientHeight / targetItem.clientHeight - 1) / 2
                    ) *
                        targetItem.clientHeight;
            }
        }
    }

    renderMenu(items, ref, props) {
        return (
            <Menu ref={ref} role="listbox" {...props}>
                {items.map(node => {
                    if (
                        React.isValidElement(node) &&
                        node.type.menuChildType === 'item'
                    ) {
                        return React.cloneElement(node, {
                            menu: this,
                        });
                    }

                    return node;
                })}
            </Menu>
        );
    }

    render() {
        const {
            prefix,
            useVirtual,
            className,
            style,
            children,
            ...others
        } = this.props;
        const menuProps = {
            labelToggleChecked: false,
            className: `${prefix}cascader-menu`,
            ...others,
        };
        return (
            <div
                ref="menu"
                className={`${prefix}cascader-menu-wrapper ${
                    className ? className : ''
                }`}
                style={style}
            >
                {useVirtual ? (
                    <VirtualList
                        ref="virtual"
                        itemsRenderer={(items, ref) =>
                            this.renderMenu(items, ref, menuProps)
                        }
                    >
                        {children}
                    </VirtualList>
                ) : (
                    this.renderMenu(children, undefined, menuProps)
                )}
            </div>
        );
    }
}
