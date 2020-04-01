import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Item from './item';

/**
 * Menu.Group
 * @order 5
 */
export default class Group extends Component {
    static menuChildType = 'group';

    static propTypes = {
        root: PropTypes.object,
        className: PropTypes.string,
        /**
         * 标签内容
         */
        label: PropTypes.node,
        /**
         * 菜单项
         */
        children: PropTypes.node,
        parentMode: PropTypes.oneOf(['inline', 'popup']),
    };

    render() {
        const {
            root,
            className,
            label,
            children,
            parentMode,
            ...others
        } = this.props;
        const { prefix } = root.props;

        const newClassName = cx({
            [`${prefix}menu-group-label`]: true,
            [className]: !!className,
        });

        const newChildren = children.map(child => {
            // to fix https://github.com/alibaba-fusion/next/issues/952
            if (typeof child !== 'function' && typeof child !== 'object') {
                return child;
            }
            const { className } = child.props;
            const newChildClassName = cx({
                [`${prefix}menu-group-item`]: true,
                [className]: !!className,
            });

            return cloneElement(child, {
                parentMode,
                className: newChildClassName,
            });
        });

        return [
            <Item
                key="menu-group-label"
                className={newClassName}
                replaceClassName
                root={root}
                parentMode={parentMode}
                {...others}
            >
                {label}
            </Item>,
            ...newChildren,
        ];
    }
}
