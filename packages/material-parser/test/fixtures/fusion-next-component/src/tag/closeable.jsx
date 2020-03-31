import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from './tag';

/**
 * Tag.Closeable
 */
class Closeable extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        className: PropTypes.any,
        /**
         * closeable 标签的 onClose 响应区域, tag: 标签体, tail(默认): 关闭按钮
         */
        closeArea: PropTypes.oneOf(['tag', 'tail']),
        /**
         * 点击关闭按钮时的回调
         * @param {String} from 事件来源, tag: 标签体点击, tail: 关闭按钮点击
         * @returns {Boolean} true则关闭, false阻止关闭
         */
        onClose: PropTypes.func,
        /**
         * 标签关闭后执行的回调
         */
        afterClose: PropTypes.func,
        /**
         * 点击回调
         */
        onClick: PropTypes.func,
        type: PropTypes.oneOf(['normal', 'primary']),
        /**
         * 标签的尺寸（large 尺寸为兼容表单场景 large = medium）
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        children: PropTypes.any,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        type: 'normal',
    };

    render() {
        const {
            disabled,
            className,
            closeArea,
            onClose,
            afterClose,
            onClick,
            type,
            size,
            children,
            rtl,
            ...others
        } = this.props;

        return (
            <Tag
                {...others}
                rtl={rtl}
                disabled={disabled}
                className={className}
                closeArea={closeArea}
                onClose={onClose}
                afterClose={afterClose}
                onClick={onClick}
                type={type}
                size={size}
                closable
            >
                {children}
            </Tag>
        );
    }
}

export default Closeable;
