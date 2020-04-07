import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Menu from '../menu';

/**
 * Nav.Group
 * @description 继承自 `Menu.Group` 的能力请查看 `Menu.Group` 文档
 */
class Group extends Component {
    static menuChildType = 'group';

    static propTypes = {
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        /**
         * 标签内容
         */
        label: PropTypes.node,
        /**
         * 导航项和子导航
         */
        children: PropTypes.node,
    };

    static contextTypes = {
        prefix: PropTypes.string,
        iconOnly: PropTypes.bool,
    };

    render() {
        const { prefix, iconOnly } = this.context;
        const { className, children, label, ...others } = this.props;

        let newLabel = label;
        if (iconOnly) {
            // TODO: add a group icon ?
            newLabel = [<span key="label">{label}</span>];
        }

        const cls = classNames({
            [`${prefix}nav-group-label`]: true,
            [className]: !!className,
        });

        return (
            <Menu.Group className={cls} label={newLabel} {...others}>
                {children}
            </Menu.Group>
        );
    }
}

export default Group;
