import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from '../menu';
import Icon from '../icon';
import Balloon from '../balloon';

const { Tooltip } = Balloon;

/**
 * Nav.Item
 * @description 继承自 `Menu.Item` 的能力请查看 `Menu.Item` 文档
 */
class Item extends Component {
    static menuChildType = 'item';

    static propTypes = {
        /**
         * 自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="icon type" />`
         */
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        /**
         * 导航内容
         */
        children: PropTypes.node,
        parentMode: PropTypes.oneOf(['inline', 'popup']),
    };

    static contextTypes = {
        prefix: PropTypes.string,
        iconOnly: PropTypes.bool,
        hasTooltip: PropTypes.bool,
    };

    render() {
        const { prefix, iconOnly, hasTooltip } = this.context;
        const { icon, children, ...others } = this.props;
        const iconEl =
            typeof icon === 'string' ? (
                <Icon className={`${prefix}nav-icon`} type={icon} />
            ) : (
                icon
            );

        const item = (
            <Menu.Item {...others}>
                {iconEl}
                {children}
            </Menu.Item>
        );

        if (iconOnly && hasTooltip && others.parentMode !== 'popup') {
            return (
                <Tooltip align="r" trigger={item}>
                    {children}
                </Tooltip>
            );
        }

        return item;
    }
}

export default Item;
