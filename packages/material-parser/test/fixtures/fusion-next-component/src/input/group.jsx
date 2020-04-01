import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Input.Group
 */
class Group extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.node,
        /**
         * 输入框前附加内容
         */
        addonBefore: PropTypes.node,
        /**
         * 输入框前附加内容css
         */
        addonBeforeClassName: PropTypes.string,
        /**
         * 输入框后附加内容
         */
        addonAfter: PropTypes.node,
        /**
         * 输入框后额外css
         */
        addonAfterClassName: PropTypes.string,
        /**
         * rtl
         */
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
    };

    render() {
        const {
            className,
            style,
            children,
            prefix,
            addonBefore,
            addonAfter,
            addonBeforeClassName,
            addonAfterClassName,
            rtl,
            ...others
        } = this.props;

        const cls = classNames({
            [`${prefix}input-group`]: true,
            [className]: !!className,
        });

        const addonCls = `${prefix}input-group-addon`;
        const beforeCls = classNames(addonCls, {
            [`${prefix}before`]: true,
            [addonBeforeClassName]: addonBeforeClassName,
        });
        const afterCls = classNames(addonCls, {
            [`${prefix}after`]: true,
            [addonAfterClassName]: addonAfterClassName,
        });

        const before = addonBefore ? (
            <span className={beforeCls}>{addonBefore}</span>
        ) : null;

        const after = addonAfter ? (
            <span className={afterCls}>{addonAfter}</span>
        ) : null;

        return (
            <span
                {...others}
                dir={rtl ? 'rtl' : undefined}
                className={cls}
                style={style}
            >
                {before}
                {children}
                {after}
            </span>
        );
    }
}

export default ConfigProvider.config(Group);
