import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { dom } from '../../util';

/**
 * Slider Track
 * 内容轨道
 */

const getSlideClasses = specProps => {
    const prefix = specProps.prefix;
    let slickActive, slickCenter;
    let centerOffset, index;

    if (specProps.rtl) {
        index = specProps.slideCount - 1 - specProps.activeIndex;
    } else {
        index = specProps.activeIndex;
    }

    const slickCloned = index < 0 || index >= specProps.slideCount;
    if (specProps.centerMode) {
        centerOffset = Math.floor(specProps.slidesToShow / 2);
        slickCenter =
            (index - specProps.currentSlide) % specProps.slideCount === 0;
        if (
            index > specProps.currentSlide - centerOffset - 1 &&
            index <= specProps.currentSlide + centerOffset
        ) {
            slickActive = true;
        }
    } else {
        slickActive =
            specProps.currentSlide <= index &&
            index < specProps.currentSlide + specProps.slidesToShow;
    }

    return classNames(`${prefix}slick-slide`, {
        [`${prefix}slick-active`]: slickActive,
        [`${prefix}slick-center`]: slickCenter,
        [`${prefix}slick-cloned`]: slickCloned,
    });
};

const getSlideStyle = function(specProps) {
    const style = {};

    if (
        specProps.variableWidth === undefined ||
        specProps.variableWidth === false
    ) {
        style.width = specProps.slideWidth;
    }

    if (specProps.animation === 'fade') {
        style.position = 'relative';

        style.opacity =
            specProps.currentSlide === specProps.activeIndex ? 1 : 0;
        style.visibility =
            specProps.currentSlide >= specProps.activeIndex
                ? 'visible'
                : 'hidden';
        style.transition = `opacity ${specProps.speed}ms ${specProps.cssEase}`;
        style.WebkitTransition = `opacity ${specProps.speed}ms ${
            specProps.cssEase
        }`;

        if (specProps.vertical) {
            style.top = -specProps.activeIndex * specProps.slideHeight;
        } else {
            style.left = -specProps.activeIndex * specProps.slideWidth;
        }
    }

    if (specProps.vertical) {
        style.width = '100%';
    }

    return style;
};

const getKey = (child, fallbackKey) => {
    // key could be a zero
    return child.key === null || child.key === undefined
        ? fallbackKey
        : child.key;
};

const renderSlides = specProps => {
    let key;
    const slides = [];
    const preCloneSlides = [];
    const postCloneSlides = [];
    const count = React.Children.count(specProps.children);
    let child;

    React.Children.forEach(specProps.children, (elem, index) => {
        const childOnClickOptions = {
            message: 'children',
            index,
            slidesToScroll: specProps.slidesToScroll,
            currentSlide: specProps.currentSlide,
        };

        if (
            !specProps.lazyLoad |
            (specProps.lazyLoad && specProps.lazyLoadedList.indexOf(index) >= 0)
        ) {
            child = elem;
        } else {
            child = elem.key ? <div key={elem.key} /> : <div />;
        }
        const childStyle = getSlideStyle({ ...specProps, activeIndex: index });
        const slickClasses = getSlideClasses({
            activeIndex: index,
            ...specProps,
        });
        let cssClasses;

        if (child.props.className) {
            cssClasses = classNames(slickClasses, child.props.className);
        } else {
            cssClasses = slickClasses;
        }

        const onClick = function(e) {
            // only child === elem, it will has .props.onClick;
            child.props && child.props.onClick && elem.props.onClick(e);
            if (specProps.focusOnSelect) {
                specProps.focusOnSelect(childOnClickOptions);
            }
        };

        slides.push(
            React.cloneElement(child, {
                key: `original${getKey(child, index)}`,
                'data-index': index,
                className: cssClasses,
                tabIndex: '-1',
                'aria-posinset': index,
                'aria-setsize': count,
                role: 'listitem',
                dir: specProps.rtl ? 'rtl' : 'ltr',
                // server-side render depend on elements of their own style
                style: !dom.hasDOM
                    ? { outline: 'none', ...childStyle, ...child.props.style }
                    : { outline: 'none', ...child.props.style, ...childStyle },
                onClick,
            })
        );

        // variableWidth doesn't wrap properly.
        if (specProps.infinite && specProps.animation !== 'fade') {
            const infiniteCount = specProps.variableWidth
                ? specProps.slidesToShow + 1
                : specProps.slidesToShow;

            if (index >= count - infiniteCount) {
                key = -(count - index);
                preCloneSlides.push(
                    React.cloneElement(child, {
                        key: `precloned${getKey(child, key)}`,
                        'data-index': key,
                        className: cssClasses,
                        style: { ...child.props.style, ...childStyle },
                    })
                );
            }

            if (index < infiniteCount) {
                key = count + index;
                postCloneSlides.push(
                    React.cloneElement(child, {
                        key: `postcloned${getKey(child, key)}`,
                        'data-index': key,
                        className: cssClasses,
                        style: { ...child.props.style, ...childStyle },
                    })
                );
            }
        }
    });
    // To support server-side rendering
    if (!dom.hasDOM) {
        return slides.slice(
            specProps.currentSlide,
            specProps.currentSlide + specProps.slidesToShow
        );
    }
    if (specProps.rtl) {
        return preCloneSlides.concat(slides, postCloneSlides).reverse();
    } else {
        return preCloneSlides.concat(slides, postCloneSlides);
    }
};

export default class Track extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        trackStyle: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
    };

    render() {
        const slides = renderSlides(this.props);
        return (
            <div
                role="list"
                className={`${this.props.prefix}slick-track`}
                style={this.props.trackStyle}
            >
                {slides}
            </div>
        );
    }
}
