import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import { obj } from '../util';

/**
 * Avatar
 */
class Avatar extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        children: PropTypes.any,
        className: PropTypes.string,
        /**
         * 头像的大小
         */
        size: PropTypes.oneOfType([
            PropTypes.oneOf(['small', 'medium', 'large']),
            PropTypes.number,
        ]),
        /**
         * 头像的形状
         */
        shape: PropTypes.oneOf(['circle', 'square']),
        /**
         * icon 类头像的图标类型，可设为 Icon 的 `type` 或 `ReactNode`
         */
        icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        /**
         * 图片类头像的资源地址
         */
        src: PropTypes.string,
        /**
         * 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为
         */
        onError: PropTypes.func,
        /**
         * 图像无法显示时的 alt 替代文本
         */
        alt: PropTypes.string,
        /**
         * 图片类头像响应式资源地址
         */
        srcSet: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        size: 'medium',
        shape: 'circle',
    };

    state = {
        isImgExist: true,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.src !== this.props.src) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ isImgExist: true });
        }
    }

    handleImgLoadError = () => {
        const { onError } = this.props;
        const errorFlag = onError ? onError() : undefined;
        if (errorFlag !== false) {
            this.setState({ isImgExist: false });
        }
    };

    getIconSize = avatarSize => {
        return typeof avatarSize === 'number' ? avatarSize / 2 : avatarSize;
    };

    render() {
        const {
            prefix,
            className,
            style,
            size,
            icon,
            alt,
            srcSet,
            shape,
            src,
        } = this.props;
        const { isImgExist } = this.state;
        let { children } = this.props;

        const others = obj.pickOthers(Avatar.propTypes, this.props);

        const cls = classNames(
            {
                [`${prefix}avatar`]: true,
                [`${prefix}avatar-${shape}`]: !!shape,
                [`${prefix}avatar-image`]: src && isImgExist,
                [`${prefix}avatar-${size}`]: typeof size === 'string',
            },
            className
        );

        const sizeStyle =
            typeof size === 'number'
                ? {
                      width: size,
                      height: size,
                      lineHeight: `${size}px`,
                      fontSize: icon ? size / 2 : 18,
                  }
                : {};

        const iconSize = this.getIconSize(size);
        if (src) {
            if (isImgExist) {
                children = (
                    <img
                        src={src}
                        srcSet={srcSet}
                        onError={this.handleImgLoadError}
                        alt={alt}
                    />
                );
            } else {
                children = <Icon type={'picture'} size={iconSize} />;
            }
        } else if (typeof icon === 'string') {
            children = <Icon type={icon} size={iconSize} />;
        } else if (icon) {
            const newIconSize =
                'size' in icon.props ? icon.props.size : iconSize;
            children = React.cloneElement(icon, { size: newIconSize });
        }

        return (
            <span
                className={cls}
                style={{ ...sizeStyle, ...style }}
                {...others}
            >
                {children}
            </span>
        );
    }
}

export default ConfigProvider.config(Avatar);
