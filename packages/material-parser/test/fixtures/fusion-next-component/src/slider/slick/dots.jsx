import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func } from '../../util';

/**
 * slider dots
 * 导航锚点
 */

const { noop } = func;

export default class Dots extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        currentSlide: PropTypes.number,
        changeSlide: PropTypes.func,
        dotsClass: PropTypes.string,
        slideCount: PropTypes.number,
        slidesToScroll: PropTypes.number,
        dotsDirection: PropTypes.oneOf(['hoz', 'ver']),
        dotsRender: PropTypes.func,
        triggerType: PropTypes.string,
    };

    static defaultProps = {
        changeSlide: noop,
    };

    handleChangeSlide(options, e) {
        e.preventDefault();

        this.props.changeSlide(options);
    }

    render() {
        const {
            prefix,
            slideCount,
            slidesToScroll,
            currentSlide,
            dotsClass,
            dotsDirection,
            dotsRender,
            triggerType,
            rtl,
        } = this.props;

        const dotsClazz = classNames(
            `${prefix}slick-dots`,
            dotsDirection,
            dotsClass
        );
        const dotCount = Math.ceil(slideCount / slidesToScroll);
        const children = [];

        for (let i = 0; i < dotCount; i++) {
            const leftBound = i * slidesToScroll;
            const rightBound = leftBound + slidesToScroll - 1;
            const itemClazz = classNames(`${prefix}slick-dots-item`, {
                active: currentSlide >= leftBound && currentSlide <= rightBound,
            });
            const dotOptions = {
                message: 'dots',
                index: i,
                slidesToScroll,
                currentSlide,
            };
            // 除非设置为hover，默认使用click触发
            const handleProp = {
                [triggerType.toLowerCase() === 'hover'
                    ? 'onMouseEnter'
                    : 'onClick']: this.handleChangeSlide.bind(this, dotOptions),
            };

            let docIndex = i;
            let currentSlideIndex = i;
            if (rtl) {
                docIndex = dotCount - 1 - i;
                currentSlideIndex = dotCount - 1 - currentSlide;
            }

            children.push(
                <li key={i} className={itemClazz} {...handleProp}>
                    {dotsRender instanceof Function ? (
                        <span>{dotsRender(docIndex, currentSlideIndex)}</span>
                    ) : (
                        // Slider is navigated by right and left arrow buttons so the dots are not required functionality
                        <button tabIndex="-1" />
                    )}
                </li>
            );
        }

        return (
            <ul className={dotsClazz} aria-hidden="true">
                {children}
            </ul>
        );
    }
}
