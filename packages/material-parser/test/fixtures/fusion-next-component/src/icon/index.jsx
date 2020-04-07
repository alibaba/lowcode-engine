import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import createFromIconfontCN from './icon-font';
import { obj } from '../util';
/**
 * Icon
 */
class Icon extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        /**
         * 指定显示哪种图标
         */
        type: PropTypes.string,
        children: PropTypes.node,
        /**
         * 指定图标大小
         * <br/>**可选值**<br/> xxs, xs, small, medium, large, xl, xxl, xxxl, inherit
         */
        size: PropTypes.oneOfType([
            PropTypes.oneOf([
                'xxs',
                'xs',
                'small',
                'medium',
                'large',
                'xl',
                'xxl',
                'xxxl',
                'inherit',
            ]),
            PropTypes.number,
        ]),
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
        size: 'medium',
    };

    static _typeMark = 'icon';

    render() {
        /* eslint-disable no-unused-vars*/
        const {
            prefix,
            type,
            size,
            className,
            rtl,
            style,
            children,
        } = this.props;
        const others = obj.pickOthers(
            Object.assign({}, Icon.propTypes),
            this.props
        );

        const classes = cx({
            [`${prefix}icon`]: true,
            [`${prefix}icon-${type}`]: !!type,
            [`${prefix}${size}`]: !!size && typeof size === 'string',
            [className]: !!className,
        });

        if (
            rtl &&
            [
                'arrow-left',
                'arrow-right',
                'arrow-double-left',
                'arrow-double-right',
                'switch',
                'sorting',
                'descending',
                'ascending',
            ].indexOf(type) !== -1
        ) {
            others.dir = 'rtl';
        }

        const sizeStyle =
            typeof size === 'number'
                ? {
                      width: size,
                      height: size,
                      lineHeight: `${size}px`,
                      fontSize: size,
                  }
                : {};

        return (
            <i
                {...others}
                style={{ ...sizeStyle, ...style }}
                className={classes}
            >
                {children}
            </i>
        );
    }
}

Icon.createFromIconfontCN = createFromIconfontCN;
export default ConfigProvider.config(Icon);
