import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func } from '../../util';

/**
 * slider dots
 * 导航锚点
 */

var noop = func.noop;
var Dots = (_temp = _class = function (_React$Component) {
    _inherits(Dots, _React$Component);

    function Dots() {
        _classCallCheck(this, Dots);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Dots.prototype.handleChangeSlide = function handleChangeSlide(options, e) {
        e.preventDefault();

        this.props.changeSlide(options);
    };

    Dots.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            slideCount = _props.slideCount,
            slidesToScroll = _props.slidesToScroll,
            currentSlide = _props.currentSlide,
            dotsClass = _props.dotsClass,
            dotsDirection = _props.dotsDirection,
            dotsRender = _props.dotsRender,
            triggerType = _props.triggerType,
            rtl = _props.rtl;


        var dotsClazz = classNames(prefix + 'slick-dots', dotsDirection, dotsClass);
        var dotCount = Math.ceil(slideCount / slidesToScroll);
        var children = [];

        for (var i = 0; i < dotCount; i++) {
            var _handleProp;

            var leftBound = i * slidesToScroll;
            var rightBound = leftBound + slidesToScroll - 1;
            var itemClazz = classNames(prefix + 'slick-dots-item', {
                active: currentSlide >= leftBound && currentSlide <= rightBound
            });
            var dotOptions = {
                message: 'dots',
                index: i,
                slidesToScroll: slidesToScroll,
                currentSlide: currentSlide
            };
            // 除非设置为hover，默认使用click触发
            var handleProp = (_handleProp = {}, _handleProp[triggerType.toLowerCase() === 'hover' ? 'onMouseEnter' : 'onClick'] = this.handleChangeSlide.bind(this, dotOptions), _handleProp);

            var docIndex = i;
            var currentSlideIndex = i;
            if (rtl) {
                docIndex = dotCount - 1 - i;
                currentSlideIndex = dotCount - 1 - currentSlide;
            }

            children.push(React.createElement(
                'li',
                _extends({ key: i, className: itemClazz }, handleProp),
                dotsRender instanceof Function ? React.createElement(
                    'span',
                    null,
                    dotsRender(docIndex, currentSlideIndex)
                ) :
                // Slider is navigated by right and left arrow buttons so the dots are not required functionality
                React.createElement('button', { tabIndex: '-1' })
            ));
        }

        return React.createElement(
            'ul',
            { className: dotsClazz, 'aria-hidden': 'true' },
            children
        );
    };

    return Dots;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    currentSlide: PropTypes.number,
    changeSlide: PropTypes.func,
    dotsClass: PropTypes.string,
    slideCount: PropTypes.number,
    slidesToScroll: PropTypes.number,
    dotsDirection: PropTypes.oneOf(['hoz', 'ver']),
    dotsRender: PropTypes.func,
    triggerType: PropTypes.string
}, _class.defaultProps = {
    changeSlide: noop
}, _temp);
Dots.displayName = 'Dots';
export { Dots as default };