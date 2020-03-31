import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from '../menu';
import Icon from '../icon';

/**
 * Nav.SubNav
 * @description 继承自 `Menu.SubMenu` 的能力请查看 `Menu.SubMenu` 文档
 */
class SubNav extends Component {
    static menuChildType = 'submenu';

    static propTypes = {
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 自定义图标，可以使用 Icon 的 type，也可以使用组件 `<Icon type="your type" />`
         */
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        /**
         * 标签内容
         */
        label: PropTypes.node,
        /**
         * 是否可选
         */
        selectable: PropTypes.bool,
        /**
         * 导航项和子导航
         */
        children: PropTypes.node,
    };

    static defaultProps = {
        selectable: false,
    };

    static contextTypes = {
        prefix: PropTypes.string,
        mode: PropTypes.string,
        iconOnly: PropTypes.bool,
        hasArrow: PropTypes.bool,
    };

    render() {
        const { prefix, iconOnly, hasArrow, mode } = this.context;
        const { className, icon, label, children, ...others } = this.props;
        const cls = classNames({
            [`${prefix}nav-sub-nav-item`]: true,
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
                        type={mode === 'popup' ? 'arrow-right' : 'arrow-down'}
                    />
                );
            }
        }
        const newLabel = [
            iconEl ? cloneElement(iconEl, { key: 'icon' }) : null,
            <span key="label">{label}</span>,
        ];

        return (
            <Menu.SubMenu className={cls} label={newLabel} {...others}>
                {children}
            </Menu.SubMenu>
        );
    }
}

export default SubNav;
