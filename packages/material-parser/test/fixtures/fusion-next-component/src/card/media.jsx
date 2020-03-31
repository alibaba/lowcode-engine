import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import { log } from '../util';

const { warning } = log;

const MEDIA_COMPONENTS = ['video', 'audio', 'picture', 'iframe', 'img'];

/**
 * Card.Media
 * @order 1
 */
class CardMedia extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
        /**
         * 背景图片地址
         */
        image: PropTypes.string,
        /**
         * 媒体源文件地址
         */
        src: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        component: 'div',
        style: {},
    };

    render() {
        const {
            prefix,
            style,
            className,
            component: Component,
            image,
            src,
            ...others
        } = this.props;

        if (!('children' in others || Boolean(image || src))) {
            warning(
                'either `children`, `image` or `src` prop must be specified.'
            );
        }

        const isMediaComponent = MEDIA_COMPONENTS.indexOf(Component) !== -1;
        const composedStyle =
            !isMediaComponent && image
                ? { backgroundImage: `url("${image}")`, ...style }
                : style;

        return (
            <Component
                {...others}
                style={composedStyle}
                className={classNames(`${prefix}card-media`, className)}
                src={isMediaComponent ? image || src : undefined}
            />
        );
    }
}

export default ConfigProvider.config(CardMedia);
