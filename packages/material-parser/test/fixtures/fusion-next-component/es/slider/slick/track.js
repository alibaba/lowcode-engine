import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { dom } from '../../util';

/**
 * Slider Track
 * 内容轨道
 */

var getSlideClasses = function getSlideClasses(specProps) {
    var _classNames;

    var prefix = specProps.prefix;
    var slickActive = void 0,
        slickCenter = void 0;
    var centerOffset = void 0,
        index = void 0;

    if (specProps.rtl) {
        index = specProps.slideCount - 1 - specProps.activeIndex;
    } else {
        index = specProps.activeIndex;
    }

    var slickCloned = index < 0 || index >= specProps.slideCount;
    if (specProps.centerMode) {
        centerOffset = Math.floor(specProps.slidesToShow / 2);
        slickCenter = (index - specProps.currentSlide) % specProps.slideCount === 0;
        if (index > specProps.currentSlide - centerOffset - 1 && index <= specProps.currentSlide + centerOffset) {
            slickActive = true;
        }
    } else {
        slickActive = specProps.currentSlide <= index && index < specProps.currentSlide + specProps.slidesToShow;
    }

    return classNames(prefix + 'slick-slide', (_classNames = {}, _classNames[prefix + 'slick-active'] = slickActive, _classNames[prefix + 'slick-center'] = slickCenter, _classNames[prefix + 'slick-cloned'] = slickCloned, _classNames));
};

var getSlideStyle = function getSlideStyle(specProps) {
    var style = {};

    if (specProps.variableWidth === undefined || specProps.variableWidth === false) {
        style.width = specProps.slideWidth;
    }

    if (specProps.animation === 'fade') {
        style.position = 'relative';

        style.opacity = specProps.currentSlide === specProps.activeIndex ? 1 : 0;
        style.visibility = specProps.currentSlide >= specProps.activeIndex ? 'visible' : 'hidden';
        style.transition = 'opacity ' + specProps.speed + 'ms ' + specProps.cssEase;
        style.WebkitTransition = 'opacity ' + specProps.speed + 'ms ' + specProps.cssEase;

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

var getKey = function getKey(child, fallbackKey) {
    // key could be a zero
    return child.key === null || child.key === undefined ? fallbackKey : child.key;
};

var renderSlides = function renderSlides(specProps) {
    var key = void 0;
    var slides = [];
    var preCloneSlides = [];
    var postCloneSlides = [];
    var count = React.Children.count(specProps.children);
    var child = void 0;

    React.Children.forEach(specProps.children, function (elem, index) {
        var childOnClickOptions = {
            message: 'children',
            index: index,
            slidesToScroll: specProps.slidesToScroll,
            currentSlide: specProps.currentSlide
        };

        if (!specProps.lazyLoad | (specProps.lazyLoad && specProps.lazyLoadedList.indexOf(index) >= 0)) {
            child = elem;
        } else {
            child = elem.key ? React.createElement('div', { key: elem.key }) : React.createElement('div', null);
        }
        var childStyle = getSlideStyle(_extends({}, specProps, { activeIndex: index }));
        var slickClasses = getSlideClasses(_extends({
            activeIndex: index
        }, specProps));
        var cssClasses = void 0;

        if (child.props.className) {
            cssClasses = classNames(slickClasses, child.props.className);
        } else {
            cssClasses = slickClasses;
        }

        var onClick = function onClick(e) {
            // only child === elem, it will has .props.onClick;
            child.props && child.props.onClick && elem.props.onClick(e);
            if (specProps.focusOnSelect) {
                specProps.focusOnSelect(childOnClickOptions);
            }
        };

        slides.push(React.cloneElement(child, {
            key: 'original' + getKey(child, index),
            'data-index': index,
            className: cssClasses,
            tabIndex: '-1',
            'aria-posinset': index,
            'aria-setsize': count,
            role: 'listitem',
            dir: specProps.rtl ? 'rtl' : 'ltr',
            // server-side render depend on elements of their own style
            style: !dom.hasDOM ? _extends({ outline: 'none' }, childStyle, child.props.style) : _extends({ outline: 'none' }, child.props.style, childStyle),
            onClick: onClick
        }));

        // variableWidth doesn't wrap properly.
        if (specProps.infinite && specProps.animation !== 'fade') {
            var infiniteCount = specProps.variableWidth ? specProps.slidesToShow + 1 : specProps.slidesToShow;

            if (index >= count - infiniteCount) {
                key = -(count - index);
                preCloneSlides.push(React.cloneElement(child, {
                    key: 'precloned' + getKey(child, key),
                    'data-index': key,
                    className: cssClasses,
                    style: _extends({}, child.props.style, childStyle)
                }));
            }

            if (index < infiniteCount) {
                key = count + index;
                postCloneSlides.push(React.cloneElement(child, {
                    key: 'postcloned' + getKey(child, key),
                    'data-index': key,
                    className: cssClasses,
                    style: _extends({}, child.props.style, childStyle)
                }));
            }
        }
    });
    // To support server-side rendering
    if (!dom.hasDOM) {
        return slides.slice(specProps.currentSlide, specProps.currentSlide + specProps.slidesToShow);
    }
    if (specProps.rtl) {
        return preCloneSlides.concat(slides, postCloneSlides).reverse();
    } else {
        return preCloneSlides.concat(slides, postCloneSlides);
    }
};

var Track = (_temp = _class = function (_Component) {
    _inherits(Track, _Component);

    function Track() {
        _classCallCheck(this, Track);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Track.prototype.render = function render() {
        var slides = renderSlides(this.props);
        return React.createElement(
            'div',
            {
                role: 'list',
                className: this.props.prefix + 'slick-track',
                style: this.props.trackStyle
            },
            slides
        );
    };

    return Track;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    trackStyle: PropTypes.object
}, _class.defaultProps = {
    prefix: 'next-'
}, _temp);
Track.displayName = 'Track';
export { Track as default };