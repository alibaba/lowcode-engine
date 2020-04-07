import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';
import { obj } from '../util';

/**
 * Divider
 */
class Divider extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        children: PropTypes.any,
        className: PropTypes.string,
        /**
         * 是否为虚线
         */
        dashed: PropTypes.bool,
        /**
         * 线是水平还是垂直类型
         */
        direction: PropTypes.oneOf(['hoz', 'ver']),
        /**
         * 分割线标题的位置
         */
        orientation: PropTypes.oneOf(['left', 'right', 'center']),
    };

    static defaultProps = {
        prefix: 'next-',
        direction: 'hoz',
        orientation: 'center',
        dashed: false,
    };

    render() {
        const {
            prefix,
            className,
            dashed,
            direction,
            orientation,
            children,
        } = this.props;
        const others = obj.pickOthers(Divider.propTypes, this.props);

        const cls = classNames(
            {
                [`${prefix}divider`]: true,
                [`${prefix}divider-dashed`]: !!dashed,
                [`${prefix}divider-${direction}`]: !!direction,
                [`${prefix}divider-with-text-${orientation}`]:
                    !!orientation && children,
            },
            className
        );

        return (
            <div role="separator" className={cls} {...others}>
                {children && (
                    <span className={`${prefix}divider-inner-text`}>
                        {children}
                    </span>
                )}
            </div>
        );
    }
}

export default ConfigProvider.config(polyfill(Divider));
