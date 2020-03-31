import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../../config-provider';

/**
 * Button.Group
 */
class ButtonGroup extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        rtl: PropTypes.bool,
        prefix: PropTypes.string,
        /**
         * 统一设置 Button 组件的按钮大小
         */
        size: PropTypes.string,
        className: PropTypes.string,
        children: PropTypes.node,
    };

    static defaultProps = {
        prefix: 'next-',
        size: 'medium',
    };

    render() {
        const {
            prefix,
            className,
            size,
            children,
            rtl,
            ...others
        } = this.props;

        const groupCls = classNames({
            [`${prefix}btn-group`]: true,
            [className]: className,
        });

        const cloneChildren = Children.map(children, child => {
            if (child) {
                return React.cloneElement(child, {
                    size: size,
                });
            }
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        return (
            <div {...others} className={groupCls}>
                {cloneChildren}
            </div>
        );
    }
}

export default ConfigProvider.config(ButtonGroup);
