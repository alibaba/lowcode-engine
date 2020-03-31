import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from '../menu';
import Icon from '../icon';

/**
 * Nav.PopupItem
 * @description 继承自 `Menu.PopupItem` 的能力请查看 `Menu.PopupItem` 文档
 */
class PopupItem extends Component {
    static menuChildType = 'submenu';

    static propTypes = {
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 自定义图标，可以使用 Icon 的 type, 也可以使用组件 `<Icon type="icon type" />`
         */
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        /**
         * 标签内容
         */
        label: PropTypes.node,
        /**
         * 弹出内容
         */
        children: PropTypes.node,
    };

    static contextTypes = {
        prefix: PropTypes.string,
        iconOnly: PropTypes.bool,
        hasArrow: PropTypes.bool,
    };

    render() {
        const { prefix, iconOnly, hasArrow } = this.context;
        const { className, icon, label, children, ...others } = this.props;
        const cls = classNames({
            [`${prefix}nav-popup-item`]: true,
            [className]: !!className,
        });
        let iconEl =
            typeof icon === 'string' ? (
                <Icon className={`${prefix}nav-icon`} type={icon} />
            ) : (
                icon
            );
        if (iconOnly) {
            if (hasArrow) {
                iconEl = (
                    <Icon
                        className={`${prefix}nav-icon-only-arrow`}
                        type="arrow-right"
                    />
                );
            }
        }
        const newLabel = [
            iconEl ? cloneElement(iconEl, { key: 'icon' }) : null,
            <span key="label">{label}</span>,
        ];

        return (
            <Menu.PopupItem className={cls} label={newLabel} {...others}>
                {children}
            </Menu.PopupItem>
        );
    }
}

export default PopupItem;
