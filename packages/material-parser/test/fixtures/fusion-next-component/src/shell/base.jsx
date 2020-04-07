import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';

export default function Base(props) {
    const { componentName } = props;
    class Shell extends Component {
        static displayName = componentName;

        static _typeMark = `Shell_${componentName}`;

        static propTypes = {
            ...ConfigProvider.propTypes,
            prefix: PropTypes.string,
            collapse: PropTypes.bool,
            miniable: PropTypes.bool,
            component: PropTypes.string,
            trigger: PropTypes.node,
            triggerProps: PropTypes.object,
            direction: PropTypes.oneOf(['hoz', 'ver']),
            align: PropTypes.oneOf(['left', 'right', 'center']),
            /**
             * 弹层显示或隐藏时触发的回调函数
             * @param {Boolean} collapse 弹层是否显示
             */
            onCollapseChange: PropTypes.func,
        };

        static defaultProps = {
            prefix: 'next-',
            component: 'div',
            onCollapseChange: () => {},
        };

        static childContextTypes = {
            isCollapse: PropTypes.bool,
        };

        getChildContext() {
            const { collapse } = this.props;

            return {
                isCollapse: collapse,
            };
        }

        render() {
            const {
                prefix,
                className,
                miniable,
                device,
                direction,
                children,
                collapse,
                triggerProps,
                onCollapseChange,
                component,
                align,
                ...others
            } = this.props;

            let Tag = component;

            const cls = classnames({
                [`${prefix}shell-${componentName.toLowerCase()}`]: true,
                [`${prefix}shell-collapse`]: !!collapse,
                [`${prefix}shell-mini`]: miniable,
                [`${prefix}shell-nav-${align}`]:
                    componentName === 'Navigation' &&
                    direction === 'hoz' &&
                    align,
                [className]: !!className,
            });

            let newChildren = children;
            if (componentName === 'Content') {
                newChildren = (
                    <div className={`${prefix}shell-content-inner`}>
                        {children}
                    </div>
                );
            }

            if (componentName === 'Page') {
                return children;
            }

            if (
                ['ToolDock'].indexOf(componentName) > -1 ||
                (componentName === 'Navigation' && direction === 'ver')
            ) {
                Tag = 'aside';
            }

            return (
                <Tag className={cls} {...others}>
                    {newChildren}
                </Tag>
            );
        }
    }

    return ConfigProvider.config(Shell);
}
